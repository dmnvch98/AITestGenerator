#!/bin/bash

set -ex

awslocal --endpoint-url=http://localhost:4566 sqs create-queue \
  --queue-name test-queue.fifo \
  --attributes FifoQueue=true,ContentBasedDeduplication=true

echo "SQS SETUP FINISHED"
set +x
