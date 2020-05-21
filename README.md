# Prerequisites

Setup Cloudtrail to log to **CloudTrail/DefaultLogGroup**.

<img src="https://s.natalian.org/2020-05-21/cloudtrail-cw-logs.png">

# How do I know if I have deployed this?

<img src="https://s.natalian.org/2020-05-21/cloudtrail-subscription.png" alt="Cloudwatch subscription">

There should be a subscription active upon **CloudTrail/DefaultLogGroup**.

# Why not use Cloudwatch events?

<https://aws.amazon.com/premiumsupport/knowledge-center/ec2-email-instance-state-change/>
is a good tip, but what they don't tell you, is that would need to deploy it
EVERY REGION for it to work.
