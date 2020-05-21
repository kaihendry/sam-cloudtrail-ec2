var zlib = require('zlib')
exports.handler = function (event) {
  console.log(event)
  if (event.awslogs && event.awslogs.data) {
    const payload = Buffer.from(event.awslogs.data, 'base64')
    const logevents = JSON.parse(zlib.unzipSync(payload).toString()).logEvents
    for (const logevent of logevents) {
      const log = JSON.parse(logevent.message)

      // console.log(JSON.stringify(log, null, 2))

      for (const machine of log.responseElements.instancesSet.items) {
        console.log(`
At ${log.eventTime}, event "${log.eventName}" on your EC2 instance ${machine.instanceId} on account ${log.recipientAccountId} in the Region ${log.awsRegion} with ${machine.tagSet.items}
https://${log.awsRegion}.console.aws.amazon.com/ec2/v2/home?region=${log.awsRegion}#Instances:search=${machine.instanceId}`)
      }
    }
  }
}
