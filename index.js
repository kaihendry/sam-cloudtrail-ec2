var AWS = require('aws-sdk')
var zlib = require('zlib')
// https://github.com/kaihendry/sam-cloudtrail-ec2
exports.handler = function (event) {
  console.log(event)
  if (event.awslogs && event.awslogs.data) {
    const payload = Buffer.from(event.awslogs.data, 'base64')
    const logevents = JSON.parse(zlib.unzipSync(payload).toString()).logEvents
    for (const logevent of logevents) {
      const log = JSON.parse(logevent.message)

      // console.log(JSON.stringify(log, null, 2))

      var message = ''
      for (const machine of log.responseElements.instancesSet.items) {
        message += `
At ${log.eventTime}, event "${log.eventName}" on your EC2 instance ${machine.instanceId} on account ${log.recipientAccountId} in the Region ${log.awsRegion} with ${JSON.stringify(machine.tagSet.items)}
https://${log.awsRegion}.console.aws.amazon.com/ec2/v2/home?region=${log.awsRegion}#Instances:search=${machine.instanceId}`
      }

      var params = { Message: message, TopicArn: process.env.NOTIFY_SNS }

      var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise()

      publishTextPromise.then(
        function (data) {
          console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`)
        }).catch(
        function (err) {
          console.error(err, err.stack)
        })
    }
  }
}
