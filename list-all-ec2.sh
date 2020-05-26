for region in $(aws ec2 describe-regions --query "Regions[*].RegionName" --output text)
do
     echo "Listing Instances in region:'$region'..."
     aws ec2 describe-instances --region $region --output table --filters Name=instance-state-name,Values=running
done
