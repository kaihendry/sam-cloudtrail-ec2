var SNS = require('aws-sdk/clients/sns')
var zlib = require('zlib')
// https://github.com/kaihendry/sam-cloudtrail-ec2
exports.handler = async function (event, context) {
  console.log(event)
  if (!event.awslogs || !event.awslogs.data) {
    context.fail(new Error('invalid Cloudwatch logs event'))
  }
  const payload = Buffer.from(event.awslogs.data, 'base64')
  const logevents = JSON.parse(zlib.unzipSync(payload).toString()).logEvents
  try {
    for (const logevent of logevents) {
      const log = JSON.parse(logevent.message)
      var message = ''
      for (const machine of log.responseElements.instancesSet.items) {
        message += `
At ${log.eventTime}, event "${log.eventName}" on your EC2 instance ${machine.instanceId} on account ${log.recipientAccountId} in the Region ${log.awsRegion} with ${JSON.stringify(machine.tagSet.items)}
https://${log.awsRegion}.console.aws.amazon.com/ec2/v2/home?region=${log.awsRegion}#Instances:search=${machine.instanceId}`
      }
      await new SNS().publish({ Message: message, TopicArn: process.env.NOTIFY_SNS }).promise()
      context.succeed()
    }
  } catch (e) {
    context.fail(e)
  }
}
