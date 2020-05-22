BUCKET = webc-cloudtrail
AWS_PROFILE = mine
NOTIFICATIONEMAIL = hendry@iki.fi

# Tweak the above for your AWS account

STACK_NAME = sam-cloudtrail-ec2

SAM = AWS_PROFILE=$(AWS_PROFILE) sam

deploy: packaged.yaml
	$(SAM) deploy --template-file packaged.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM \
		--parameter-overrides NotificationEmail=$(NOTIFICATIONEMAIL) \
		--no-fail-on-empty-changeset

packaged.yaml: template.yaml index.js
	$(SAM) package --template-file template.yaml --s3-bucket $(BUCKET) \
		--output-template-file packaged.yaml

clean:
	rm -f packaged.yaml

destroy:
	AWS_PROFILE=$(AWS_PROFILE) aws cloudformation delete-stack --stack-name $(STACK_NAME)

test: env.json event.json
	AWS_PROFILE=$(AWS_PROFILE) sam local invoke -e event.json --env-vars env.json
