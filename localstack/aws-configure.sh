#!/bin/bash

set -ex

AWS_PROFILE_NAME="dev"
AWS_ACCESS_KEY_ID="foo"
AWS_SECRET_ACCESS_KEY="bar"
AWS_REGION="eu-central-1"
AWS_OUTPUT_FORMAT="json"

# Настраиваем профиль AWS CLI
aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID" --profile "$AWS_PROFILE_NAME"
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY" --profile "$AWS_PROFILE_NAME"
aws configure set region "$AWS_REGION" --profile "$AWS_PROFILE_NAME"
aws configure set output "$AWS_OUTPUT_FORMAT" --profile "$AWS_PROFILE_NAME"

echo "AWS CLI configuration completed for profile '$AWS_PROFILE_NAME'"

set +x
