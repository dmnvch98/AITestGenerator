#!/bin/bash

set -ex

awslocal --endpoint-url=http://localhost:4566 sqs create-queue \
  --queue-name test-generation.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true \
  --region eu-central-1

echo "SQS SETUP FINISHED"
set +x
