var AWS = require('aws-sdk')
var zlib = require('zlib')
// https://github.com/kaihendry/sam-cloudtrail-ec2
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  if (!event.awslogs || !event.awslogs.data) {
    console.error('invalid Cloudwatch logs event')
    return
  }

  const { Arn } = await new AWS.STS().getCallerIdentity().promise()
  console.log('Permissions context', Arn)

  const payload = Buffer.from(event.awslogs.data, 'base64')
  const logevents = JSON.parse(zlib.unzipSync(payload).toString()).logEvents
  try {
    for (const logevent of logevents) {
      const log = JSON.parse(logevent.message)
      // console.log(JSON.stringify(log, null, 2))
      // console.log('response elements', JSON.stringify(log.responseElements.instancesSet.items, null, 2))
      var message = ''
      for (const machine of log.responseElements.instancesSet.items) {
        console.log('machine', machine)
        message += `At ${log.eventTime}, event "${log.eventName}" on your EC2 instance ${machine.instanceId} on account ${log.recipientAccountId} in the Region ${log.awsRegion}.\n`
        if (machine.tagSet && machine.tagSet.items) { message += `Tags: ${JSON.stringify(machine.tagSet.items)}\n` }
        message += `https://${log.awsRegion}.console.aws.amazon.com/ec2/v2/home?region=${log.awsRegion}#Instances:search=${machine.instanceId}\n`
      }
      const params = { Message: message, TopicArn: process.env.TOPICARN }
      console.log('Notifying', params)
      var publishResponse = await new AWS.SNS().publish(params).promise()
      console.log(publishResponse)
    }
  } catch (e) {
    console.error(e)
  }
}
