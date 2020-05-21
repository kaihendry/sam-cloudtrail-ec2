AWS_PROFILE = teamwork-sysmaster
STACK_NAME = sam-cloudtrail-ec2
BUCKET = sg-corexpert-trail

SAM = AWS_PROFILE=$(AWS_PROFILE) sam

deploy: packaged.yaml
	$(SAM) deploy --template-file packaged.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM \
		--no-fail-on-empty-changeset

packaged.yaml: template.yaml
	$(SAM) package --template-file template.yaml --s3-bucket $(BUCKET) \
		--output-template-file packaged.yaml

clean:
	rm -f packaged.yaml

destroy:
	AWS_PROFILE=$(AWS_PROFILE) aws cloudformation delete-stack --stack-name $(STACK_NAME)
