set -e
REGION=eu-west-1
id=$(aws ec2 run-instances --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${PWD##*/}}]" --image-id resolve:ssm:/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2 --region $REGION --query Instances[].InstanceId --output text)
echo Waiting for $id to exist..
aws ec2 wait instance-exists --instance-ids $id --region $REGION
echo $id exists, terminating
aws ec2 terminate-instances --instance-ids $id --region $REGION
