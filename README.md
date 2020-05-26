# Prerequisites

Setup Cloudtrail to log to **CloudTrail/DefaultLogGroup**.

<img src="https://s.natalian.org/2020-05-21/cloudtrail-cw-logs.png">

Setup an SNS Topic with subscribers who would like to be informed when an EC2
is launched in any AWS region.

# How do I know if I have deployed this?

<img src="https://s.natalian.org/2020-05-21/cloudtrail-subscription.png" alt="Cloudwatch subscription">

There should be a subscription active upon **CloudTrail/DefaultLogGroup**.

Btw it takes **~15 minutes** for Cloudtrail to capture and log the event in [CloudWatch](https://ap-southeast-1.console.aws.amazon.com/cloudwatch/home?region=ap-southeast-1#logEventViewer:group=CloudTrail/DefaultLogGroup;filter=%257B%2520%2524.eventName%2520%253D%2520%2522RunInstances%2522%2520%257D) in my experience.

# Why not use Cloudwatch events?

<https://aws.amazon.com/premiumsupport/knowledge-center/ec2-email-instance-state-change/>
is a good tip, but what they don't tell you, is that would need to deploy it in
EVERY REGION for it to work.

# Maintenance consideration

Cloudtrail bucket isn't used, so think about putting expiration on the objects.

Similarly **CloudTrail/DefaultLogGroup** can get large, put a retention policy
on.

# TODO

Maybe implement the other events: <https://aws.amazon.com/premiumsupport/knowledge-center/cloudtrail-search-api-calls/>
