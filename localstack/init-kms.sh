#!/bin/bash

set -ex

awslocal kms create-key

echo "KMS SETUP FINISHED"
set +x
