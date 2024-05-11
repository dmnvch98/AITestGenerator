#!/bin/bash

set -ex

awslocal kms create-key
awslocal --endpoint-url=http://localhost:4566 sqs create-queue --queue-name test-queue

echo "INFRA SETUP FINISHED"
set +x
