#!/bin/bash

set -ex

awslocal s3api create-bucket --bucket files-bucket --region us-east-1

echo "S3 SETUP FINISHED"
set +x
