![alt text](swclogo.jpg)
# CDKCasStack
This repository contains aws cdk to deploy s3 custom react todo app, s3, vpc, acm, cname and A records, LB, ECS and custom container image. For additional details, please email at [christopher.sargent@sargentwalker.io](mailto:christopher.sargent@sargentwalker.io).

# Install aws cli
1. ssh cas@172.18.0.193
2. sudo -i 
3. curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
4. apt install unzip -y && unzip awscliv2.zip
5. ./aws/install -i /usr/local/aws-cli -b /usr/local/bin/
6. export PATH=/usr/local/bin/:$PATH
7. complete -C '/usr/local/bin/aws_completer' aws
8. aws configure
9. aws s3 ls
```
2023-07-14 09:56:13 cass301
```
# Install Node js
1. ssh cas@172.18.0.193
2. sudo -i 
3. curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
4. bash nodesource_setup.sh
5. apt install gcc g++ make nodejs -y 
6. node -v
```
v18.16.1
```
7. npm -v
```
9.5.1
```
# Install AWS CDK
1. ssh cas@172.18.0.193
2. sudo -i 
3. npm install -g aws-cdk@2.25.0

# Install yarn
1. ssh cas@172.18.0.193
2. sudo -i 
3. curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
4. echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
5. apt install yarn -y 
6. yarn --version 
```
0.32+git
```
7. curl --compressed -o- -L https://yarnpkg.com/install.sh | bash
8. yarn --version 
```
1.22.19
```
# Install CDKCasStack
1. ssh cas@172.18.0.193
2. sudo -i
3. cd /home/cas/AWS-CDK-in-Practice/chapter-4-complete-web-application-deployment-with-aws-cdk
4. vim config.json
* Note that cas.sh is a domain that I own in Namecheap
```
{
  "domain_name": "cas.sh",
  "backend_subdomain": "backend",
  "frontend_subdomain": "frontend"
}
```
5. vim infrastructure/bin/chapter-4.ts
* Add AWS account and preferred region on env: line
```
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { Chapter3Stack } from '../lib/chapter-4-stack';

const app = new cdk.App();

new Chapter3Stack(app, 'Chapter4Stack', {
//  env: { region: 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT },
    env: { account: '507370583167', region: 'us-east-1' },
});
```
6. cd web && yarn && yarn build 
7. cd /home/cas/AWS-CDK-in-Practice/chapter-4-complete-web-application-deployment-with-aws-cdk/infrastructure && npm install && tsc
8. cdk synth
```
Resources:
  Certificate4E7ABB08:
    Type: AWS::CertificateManager::Certificate
    Properties:
      DomainName: cas.sh
      DomainValidationOptions:
        - DomainName: cas.sh
          HostedZoneId: Z02121921778TTILNLBVT
      SubjectAlternativeNames:
        - "*.cas.sh"
      ValidationMethod: DNS
    Metadata:
      aws:cdk:path: Chapter4Stack/Certificate/Resource
  MyVPCAFB07A31:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      InstanceTenancy: default
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/Resource
  MyVPCingressSubnet1Subnet826B3239:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1a
      CidrBlock: 10.0.0.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: aws-cdk:subnet-name
          Value: ingress
        - Key: aws-cdk:subnet-type
          Value: Public
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet1/Subnet
  MyVPCingressSubnet1RouteTableB42CFE20:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet1/RouteTable
  MyVPCingressSubnet1RouteTableAssociationC24F338C:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet1RouteTableB42CFE20
      SubnetId:
        Ref: MyVPCingressSubnet1Subnet826B3239
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet1/RouteTableAssociation
  MyVPCingressSubnet1DefaultRoute284CEB77:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet1RouteTableB42CFE20
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId:
        Ref: MyVPCIGW30AB6DD6
    DependsOn:
      - MyVPCVPCGWE6F260E1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet1/DefaultRoute
  MyVPCingressSubnet1EIPEFD3F682:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet1/EIP
  MyVPCingressSubnet1NATGateway33681E44:
    Type: AWS::EC2::NatGateway
    Properties:
      SubnetId:
        Ref: MyVPCingressSubnet1Subnet826B3239
      AllocationId:
        Fn::GetAtt:
          - MyVPCingressSubnet1EIPEFD3F682
          - AllocationId
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet1/NATGateway
  MyVPCingressSubnet2Subnet1C4FF535:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1b
      CidrBlock: 10.0.1.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: aws-cdk:subnet-name
          Value: ingress
        - Key: aws-cdk:subnet-type
          Value: Public
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet2
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet2/Subnet
  MyVPCingressSubnet2RouteTable9F8D47F4:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet2
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet2/RouteTable
  MyVPCingressSubnet2RouteTableAssociation89A79312:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet2RouteTable9F8D47F4
      SubnetId:
        Ref: MyVPCingressSubnet2Subnet1C4FF535
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet2/RouteTableAssociation
  MyVPCingressSubnet2DefaultRoute6FDE9456:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet2RouteTable9F8D47F4
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId:
        Ref: MyVPCIGW30AB6DD6
    DependsOn:
      - MyVPCVPCGWE6F260E1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet2/DefaultRoute
  MyVPCingressSubnet2EIP7F8C559A:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet2
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet2/EIP
  MyVPCingressSubnet2NATGateway0DA97D15:
    Type: AWS::EC2::NatGateway
    Properties:
      SubnetId:
        Ref: MyVPCingressSubnet2Subnet1C4FF535
      AllocationId:
        Fn::GetAtt:
          - MyVPCingressSubnet2EIP7F8C559A
          - AllocationId
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet2
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet2/NATGateway
  MyVPCingressSubnet3Subnet01F7F4E4:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1c
      CidrBlock: 10.0.2.0/24
      MapPublicIpOnLaunch: true
      Tags:
        - Key: aws-cdk:subnet-name
          Value: ingress
        - Key: aws-cdk:subnet-type
          Value: Public
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet3
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet3/Subnet
  MyVPCingressSubnet3RouteTable5E2E1EA6:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet3
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet3/RouteTable
  MyVPCingressSubnet3RouteTableAssociation2F73A846:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet3RouteTable5E2E1EA6
      SubnetId:
        Ref: MyVPCingressSubnet3Subnet01F7F4E4
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet3/RouteTableAssociation
  MyVPCingressSubnet3DefaultRoute4724FC03:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId:
        Ref: MyVPCingressSubnet3RouteTable5E2E1EA6
      DestinationCidrBlock: 0.0.0.0/0
      GatewayId:
        Ref: MyVPCIGW30AB6DD6
    DependsOn:
      - MyVPCVPCGWE6F260E1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet3/DefaultRoute
  MyVPCingressSubnet3EIPBF58E0CA:
    Type: AWS::EC2::EIP
    Properties:
      Domain: vpc
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet3
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet3/EIP
  MyVPCingressSubnet3NATGateway99FB4363:
    Type: AWS::EC2::NatGateway
    Properties:
      SubnetId:
        Ref: MyVPCingressSubnet3Subnet01F7F4E4
      AllocationId:
        Fn::GetAtt:
          - MyVPCingressSubnet3EIPBF58E0CA
          - AllocationId
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/ingressSubnet3
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/ingressSubnet3/NATGateway
  MyVPCcomputeSubnet1Subnet13EB6C6D:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1a
      CidrBlock: 10.0.3.0/24
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: compute
        - Key: aws-cdk:subnet-type
          Value: Private
        - Key: Name
          Value: Chapter4Stack/MyVPC/computeSubnet1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet1/Subnet
  MyVPCcomputeSubnet1RouteTableE444B407:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/computeSubnet1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet1/RouteTable
  MyVPCcomputeSubnet1RouteTableAssociation545714D8:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet1RouteTableE444B407
      SubnetId:
        Ref: MyVPCcomputeSubnet1Subnet13EB6C6D
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet1/RouteTableAssociation
  MyVPCcomputeSubnet1DefaultRoute3E741F04:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet1RouteTableE444B407
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId:
        Ref: MyVPCingressSubnet1NATGateway33681E44
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet1/DefaultRoute
  MyVPCcomputeSubnet2SubnetC720E999:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1b
      CidrBlock: 10.0.4.0/24
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: compute
        - Key: aws-cdk:subnet-type
          Value: Private
        - Key: Name
          Value: Chapter4Stack/MyVPC/computeSubnet2
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet2/Subnet
  MyVPCcomputeSubnet2RouteTable7F9BBD0C:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/computeSubnet2
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet2/RouteTable
  MyVPCcomputeSubnet2RouteTableAssociationAA4AF9CA:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet2RouteTable7F9BBD0C
      SubnetId:
        Ref: MyVPCcomputeSubnet2SubnetC720E999
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet2/RouteTableAssociation
  MyVPCcomputeSubnet2DefaultRouteF6E72A84:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet2RouteTable7F9BBD0C
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId:
        Ref: MyVPCingressSubnet2NATGateway0DA97D15
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet2/DefaultRoute
  MyVPCcomputeSubnet3SubnetAD3DE84C:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1c
      CidrBlock: 10.0.5.0/24
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: compute
        - Key: aws-cdk:subnet-type
          Value: Private
        - Key: Name
          Value: Chapter4Stack/MyVPC/computeSubnet3
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet3/Subnet
  MyVPCcomputeSubnet3RouteTable6C11E432:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/computeSubnet3
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet3/RouteTable
  MyVPCcomputeSubnet3RouteTableAssociationB65CE417:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet3RouteTable6C11E432
      SubnetId:
        Ref: MyVPCcomputeSubnet3SubnetAD3DE84C
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet3/RouteTableAssociation
  MyVPCcomputeSubnet3DefaultRoute5108908F:
    Type: AWS::EC2::Route
    Properties:
      RouteTableId:
        Ref: MyVPCcomputeSubnet3RouteTable6C11E432
      DestinationCidrBlock: 0.0.0.0/0
      NatGatewayId:
        Ref: MyVPCingressSubnet3NATGateway99FB4363
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/computeSubnet3/DefaultRoute
  MyVPCrdsSubnet1Subnet923AFB93:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1a
      CidrBlock: 10.0.6.0/28
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: rds
        - Key: aws-cdk:subnet-type
          Value: Isolated
        - Key: Name
          Value: Chapter4Stack/MyVPC/rdsSubnet1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet1/Subnet
  MyVPCrdsSubnet1RouteTable63F43E5F:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/rdsSubnet1
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet1/RouteTable
  MyVPCrdsSubnet1RouteTableAssociation30DA2878:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCrdsSubnet1RouteTable63F43E5F
      SubnetId:
        Ref: MyVPCrdsSubnet1Subnet923AFB93
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet1/RouteTableAssociation
  MyVPCrdsSubnet2Subnet12A42E21:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1b
      CidrBlock: 10.0.6.16/28
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: rds
        - Key: aws-cdk:subnet-type
          Value: Isolated
        - Key: Name
          Value: Chapter4Stack/MyVPC/rdsSubnet2
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet2/Subnet
  MyVPCrdsSubnet2RouteTable78F32F5A:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/rdsSubnet2
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet2/RouteTable
  MyVPCrdsSubnet2RouteTableAssociationB51FD5B4:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCrdsSubnet2RouteTable78F32F5A
      SubnetId:
        Ref: MyVPCrdsSubnet2Subnet12A42E21
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet2/RouteTableAssociation
  MyVPCrdsSubnet3Subnet3F66F75E:
    Type: AWS::EC2::Subnet
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      AvailabilityZone: us-east-1c
      CidrBlock: 10.0.6.32/28
      MapPublicIpOnLaunch: false
      Tags:
        - Key: aws-cdk:subnet-name
          Value: rds
        - Key: aws-cdk:subnet-type
          Value: Isolated
        - Key: Name
          Value: Chapter4Stack/MyVPC/rdsSubnet3
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet3/Subnet
  MyVPCrdsSubnet3RouteTable24A0303E:
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC/rdsSubnet3
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet3/RouteTable
  MyVPCrdsSubnet3RouteTableAssociation650CFA8D:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      RouteTableId:
        Ref: MyVPCrdsSubnet3RouteTable24A0303E
      SubnetId:
        Ref: MyVPCrdsSubnet3Subnet3F66F75E
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/rdsSubnet3/RouteTableAssociation
  MyVPCIGW30AB6DD6:
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: Chapter4Stack/MyVPC
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/IGW
  MyVPCVPCGWE6F260E1:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId:
        Ref: MyVPCAFB07A31
      InternetGatewayId:
        Ref: MyVPCIGW30AB6DD6
    Metadata:
      aws:cdk:path: Chapter4Stack/MyVPC/VPCGW
  WebBucket12880F5B:
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: BucketOwnerFullControl
      BucketName: chapter-4-web-bucket1-akemxdjqkl
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        IgnorePublicAcls: true
      Tags:
        - Key: aws-cdk:auto-delete-objects
          Value: "true"
        - Key: aws-cdk:cr-owned:179f471a
          Value: "true"
      WebsiteConfiguration:
        ErrorDocument: index.html
        IndexDocument: index.html
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: Chapter4Stack/WebBucket/Resource
  WebBucketPolicy95D08FAA:
    Type: AWS::S3::BucketPolicy
    Properties:
      Bucket:
        Ref: WebBucket12880F5B
      PolicyDocument:
        Statement:
          - Action: s3:GetObject
            Effect: Allow
            Principal:
              AWS: "*"
            Resource:
              Fn::Join:
                - ""
                - - Fn::GetAtt:
                      - WebBucket12880F5B
                      - Arn
                  - /*
          - Action:
              - s3:DeleteObject*
              - s3:GetBucket*
              - s3:List*
            Effect: Allow
            Principal:
              AWS:
                Fn::GetAtt:
                  - CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092
                  - Arn
            Resource:
              - Fn::GetAtt:
                  - WebBucket12880F5B
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - WebBucket12880F5B
                        - Arn
                    - /*
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: Chapter4Stack/WebBucket/Policy/Resource
  WebBucketAutoDeleteObjectsCustomResource9C1A079F:
    Type: Custom::S3AutoDeleteObjects
    Properties:
      ServiceToken:
        Fn::GetAtt:
          - CustomS3AutoDeleteObjectsCustomResourceProviderHandler9D90184F
          - Arn
      BucketName:
        Ref: WebBucket12880F5B
    DependsOn:
      - WebBucketPolicy95D08FAA
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: Chapter4Stack/WebBucket/AutoDeleteObjectsCustomResource/Default
  CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
      ManagedPolicyArns:
        - Fn::Sub: arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    Metadata:
      aws:cdk:path: Chapter4Stack/Custom::S3AutoDeleteObjectsCustomResourceProvider/Role
  CustomS3AutoDeleteObjectsCustomResourceProviderHandler9D90184F:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        S3Bucket: cdk-hnb659fds-assets-507370583167-us-east-1
        S3Key: e57c1acaa363d7d2b81736776007a7091bc73dff4aeb8135627c4511a51e7dca.zip
      Timeout: 900
      MemorySize: 128
      Handler: __entrypoint__.handler
      Role:
        Fn::GetAtt:
          - CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092
          - Arn
      Runtime: nodejs14.x
      Description:
        Fn::Join:
          - ""
          - - "Lambda function for auto-deleting objects in "
            - Ref: WebBucket12880F5B
            - " S3 bucket."
    DependsOn:
      - CustomS3AutoDeleteObjectsCustomResourceProviderRole3B1BD092
    Metadata:
      aws:cdk:path: Chapter4Stack/Custom::S3AutoDeleteObjectsCustomResourceProvider/Handler
      aws:asset:path: asset.e57c1acaa363d7d2b81736776007a7091bc73dff4aeb8135627c4511a51e7dca
      aws:asset:property: Code
  WebBucketDeploymentAwsCliLayer8D873B2B:
    Type: AWS::Lambda::LayerVersion
    Properties:
      Content:
        S3Bucket: cdk-hnb659fds-assets-507370583167-us-east-1
        S3Key: d21f8b6ad7cafde52be800b4bc2704085a5402ea7401fa71bd8f1e3f995c6068.zip
      Description: /opt/awscli/aws
    Metadata:
      aws:cdk:path: Chapter4Stack/WebBucketDeployment/AwsCliLayer/Resource
      aws:asset:path: asset.d21f8b6ad7cafde52be800b4bc2704085a5402ea7401fa71bd8f1e3f995c6068.zip
      aws:asset:is-bundled: false
      aws:asset:property: Content
  WebBucketDeploymentCustomResource56B941FB:
    Type: Custom::CDKBucketDeployment
    Properties:
      ServiceToken:
        Fn::GetAtt:
          - CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536
          - Arn
      SourceBucketNames:
        - cdk-hnb659fds-assets-507370583167-us-east-1
      SourceObjectKeys:
        - 826c31f058a2a05acef6e69e88133dc07acf041dbaec4334c05fb4f71ad4410b.zip
      DestinationBucketName:
        Ref: WebBucket12880F5B
      Prune: true
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: Chapter4Stack/WebBucketDeployment/CustomResource/Default
  CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
        Version: "2012-10-17"
      ManagedPolicyArns:
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    Metadata:
      aws:cdk:path: Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/Resource
  CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - s3:GetBucket*
              - s3:GetObject*
              - s3:List*
            Effect: Allow
            Resource:
              - Fn::Join:
                  - ""
                  - - "arn:"
                    - Ref: AWS::Partition
                    - :s3:::cdk-hnb659fds-assets-507370583167-us-east-1
              - Fn::Join:
                  - ""
                  - - "arn:"
                    - Ref: AWS::Partition
                    - :s3:::cdk-hnb659fds-assets-507370583167-us-east-1/*
          - Action:
              - s3:Abort*
              - s3:DeleteObject*
              - s3:GetBucket*
              - s3:GetObject*
              - s3:List*
              - s3:PutObject
              - s3:PutObjectLegalHold
              - s3:PutObjectRetention
              - s3:PutObjectTagging
              - s3:PutObjectVersionTagging
            Effect: Allow
            Resource:
              - Fn::GetAtt:
                  - WebBucket12880F5B
                  - Arn
              - Fn::Join:
                  - ""
                  - - Fn::GetAtt:
                        - WebBucket12880F5B
                        - Arn
                    - /*
        Version: "2012-10-17"
      PolicyName: CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF
      Roles:
        - Ref: CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265
    Metadata:
      aws:cdk:path: Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource
  CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        S3Bucket: cdk-hnb659fds-assets-507370583167-us-east-1
        S3Key: f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da.zip
      Role:
        Fn::GetAtt:
          - CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265
          - Arn
      Handler: index.handler
      Layers:
        - Ref: WebBucketDeploymentAwsCliLayer8D873B2B
      Runtime: python3.7
      Timeout: 900
    DependsOn:
      - CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF
      - CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265
    Metadata:
      aws:cdk:path: Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/Resource
      aws:asset:path: asset.f98b78092dcdd31f5e6d47489beb5f804d4835ef86a8085d0a2053cb9ae711da
      aws:asset:is-bundled: false
      aws:asset:property: Code
  FrontendDistributionA73E09FE:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Aliases:
          - frontend.cas.sh
        DefaultCacheBehavior:
          CachePolicyId: 658327ea-f89d-4fab-a63d-7e88639e58f6
          Compress: true
          TargetOriginId: Chapter4StackFrontendDistributionOrigin1E428E320
          ViewerProtocolPolicy: redirect-to-https
        DefaultRootObject: index.html
        Enabled: true
        HttpVersion: http2
        IPV6Enabled: true
        Origins:
          - CustomOriginConfig:
              OriginProtocolPolicy: http-only
              OriginSSLProtocols:
                - TLSv1.2
            DomainName:
              Fn::Select:
                - 2
                - Fn::Split:
                    - /
                    - Fn::GetAtt:
                        - WebBucket12880F5B
                        - WebsiteURL
            Id: Chapter4StackFrontendDistributionOrigin1E428E320
        ViewerCertificate:
          AcmCertificateArn:
            Ref: Certificate4E7ABB08
          MinimumProtocolVersion: TLSv1.2_2021
          SslSupportMethod: sni-only
    Metadata:
      aws:cdk:path: Chapter4Stack/Frontend-Distribution/Resource
  FrontendAliasRecordAF9BE7A7:
    Type: AWS::Route53::RecordSet
    Properties:
      Name: frontend.cas.sh.
      Type: A
      AliasTarget:
        DNSName:
          Fn::GetAtt:
            - FrontendDistributionA73E09FE
            - DomainName
        HostedZoneId:
          Fn::FindInMap:
            - AWSCloudFrontPartitionHostedZoneIdMap
            - Ref: AWS::Partition
            - zoneId
      HostedZoneId: Z02121921778TTILNLBVT
    Metadata:
      aws:cdk:path: Chapter4Stack/FrontendAliasRecord/Resource
  MySQLCredentials5BC70F0C:
    Type: AWS::SecretsManager::Secret
    Properties:
      Description:
        Fn::Join:
          - ""
          - - "Generated by the CDK for stack: "
            - Ref: AWS::StackName
      GenerateSecretString:
        ExcludeCharacters: " %+~`#$&*()|[]{}:;<>?!'/@\"\\"
        GenerateStringKey: password
        PasswordLength: 30
        SecretStringTemplate: '{"username":"admin"}'
      Name: chapter-4/rds/my-sql-instance
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: Chapter4Stack/MySQLCredentials/Resource
  MySQLCredentialsAttachment638E3417:
    Type: AWS::SecretsManager::SecretTargetAttachment
    Properties:
      SecretId:
        Ref: MySQLCredentials5BC70F0C
      TargetId:
        Ref: MySQLRDSInstance7A115F1C
      TargetType: AWS::RDS::DBInstance
    Metadata:
      aws:cdk:path: Chapter4Stack/MySQLCredentials/Attachment/Resource
  MySQLRDSInstanceSubnetGroup6AE13D8A:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupDescription: Subnet group for MySQL-RDS-Instance database
      SubnetIds:
        - Ref: MyVPCrdsSubnet1Subnet923AFB93
        - Ref: MyVPCrdsSubnet2Subnet12A42E21
        - Ref: MyVPCrdsSubnet3Subnet3F66F75E
    Metadata:
      aws:cdk:path: Chapter4Stack/MySQL-RDS-Instance/SubnetGroup/Default
  MySQLRDSInstanceSecurityGroupAB593A47:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Security group for MySQL-RDS-Instance database
      SecurityGroupEgress:
        - CidrIp: 0.0.0.0/0
          Description: Allow all outbound traffic by default
          IpProtocol: "-1"
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: Chapter4Stack/MySQL-RDS-Instance/SecurityGroup/Resource
  MySQLRDSInstanceSecurityGroupfromChapter4StackFunctionSecurityGroup6DD1AE6D33066BCB0142:
    Type: AWS::EC2::SecurityGroupIngress
    Properties:
      IpProtocol: tcp
      Description: from Chapter4StackFunctionSecurityGroup6DD1AE6D:3306
      FromPort: 3306
      GroupId:
        Fn::GetAtt:
          - MySQLRDSInstanceSecurityGroupAB593A47
          - GroupId
      SourceSecurityGroupId:
        Fn::GetAtt:
          - FunctionSecurityGroup242362F8
          - GroupId
      ToPort: 3306
    Metadata:
      aws:cdk:path: Chapter4Stack/MySQL-RDS-Instance/SecurityGroup/from Chapter4StackFunctionSecurityGroup6DD1AE6D:3306
  MySQLRDSInstanceSecurityGroupfromChapter4StackEcsClusterDefaultAutoScalingGroupInstanceSecurityGroupC07A8DE23306407E89BC:
    Type: AWS::EC2::SecurityGroupIngress
    Properties:
      IpProtocol: tcp
      Description: from Chapter4StackEcsClusterDefaultAutoScalingGroupInstanceSecurityGroupC07A8DE2:3306
      FromPort: 3306
      GroupId:
        Fn::GetAtt:
          - MySQLRDSInstanceSecurityGroupAB593A47
          - GroupId
      SourceSecurityGroupId:
        Fn::GetAtt:
          - EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231
          - GroupId
      ToPort: 3306
    Metadata:
      aws:cdk:path: Chapter4Stack/MySQL-RDS-Instance/SecurityGroup/from Chapter4StackEcsClusterDefaultAutoScalingGroupInstanceSecurityGroupC07A8DE2:3306
  MySQLRDSInstance7A115F1C:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceClass: db.t2.small
      AllocatedStorage: "100"
      CopyTagsToSnapshot: true
      DBInstanceIdentifier: my-sql-instance
      DBName: todolist
      DBSubnetGroupName:
        Ref: MySQLRDSInstanceSubnetGroup6AE13D8A
      Engine: mysql
      EngineVersion: 8.0.28
      MasterUsername:
        Fn::Join:
          - ""
          - - "{{resolve:secretsmanager:"
            - Ref: MySQLCredentials5BC70F0C
            - :SecretString:username::}}
      MasterUserPassword:
        Fn::Join:
          - ""
          - - "{{resolve:secretsmanager:"
            - Ref: MySQLCredentials5BC70F0C
            - :SecretString:password::}}
      Port: "3306"
      PubliclyAccessible: false
      StorageType: gp2
      VPCSecurityGroups:
        - Fn::GetAtt:
            - MySQLRDSInstanceSecurityGroupAB593A47
            - GroupId
    UpdateReplacePolicy: Snapshot
    DeletionPolicy: Snapshot
    Metadata:
      aws:cdk:path: Chapter4Stack/MySQL-RDS-Instance/Resource
  FunctionSecurityGroup242362F8:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Chapter4Stack/Function-SecurityGroup
      GroupName: MyRdsInitFunctionSecurityGroup
      SecurityGroupEgress:
        - CidrIp: 0.0.0.0/0
          Description: Allow all outbound traffic by default
          IpProtocol: "-1"
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: Chapter4Stack/Function-SecurityGroup/Resource
  FunctionServiceRole675BB04A:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
        Version: "2012-10-17"
      ManagedPolicyArns:
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole
    Metadata:
      aws:cdk:path: Chapter4Stack/Function/ServiceRole/Resource
  FunctionServiceRoleDefaultPolicy2F49994A:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - secretsmanager:DescribeSecret
              - secretsmanager:GetSecretValue
            Effect: Allow
            Resource:
              Ref: MySQLCredentials5BC70F0C
        Version: "2012-10-17"
      PolicyName: FunctionServiceRoleDefaultPolicy2F49994A
      Roles:
        - Ref: FunctionServiceRole675BB04A
    Metadata:
      aws:cdk:path: Chapter4Stack/Function/ServiceRole/DefaultPolicy/Resource
  Function76856677:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        ImageUri:
          Fn::Sub: 507370583167.dkr.ecr.us-east-1.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-507370583167-us-east-1:2a261ce05489114f6b967cf7445c3d18a84364220a596b2ad1238d82bf769890
      Role:
        Fn::GetAtt:
          - FunctionServiceRole675BB04A
          - Arn
      FunctionName: MyRdsInit-ResInitChapter4Stack
      MemorySize: 128
      PackageType: Image
      Timeout: 120
      VpcConfig:
        SecurityGroupIds:
          - Fn::GetAtt:
              - FunctionSecurityGroup242362F8
              - GroupId
        SubnetIds:
          - Ref: MyVPCcomputeSubnet1Subnet13EB6C6D
          - Ref: MyVPCcomputeSubnet2SubnetC720E999
          - Ref: MyVPCcomputeSubnet3SubnetAD3DE84C
    DependsOn:
      - FunctionServiceRoleDefaultPolicy2F49994A
      - FunctionServiceRole675BB04A
    Metadata:
      aws:cdk:path: Chapter4Stack/Function/Resource
      aws:asset:path: asset.2a261ce05489114f6b967cf7445c3d18a84364220a596b2ad1238d82bf769890
      aws:asset:dockerfile-path: Dockerfile
      aws:asset:property: Code.ImageUri
  FunctionLogRetention5FDF6B4D:
    Type: Custom::LogRetention
    Properties:
      ServiceToken:
        Fn::GetAtt:
          - LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A
          - Arn
      LogGroupName:
        Fn::Join:
          - ""
          - - /aws/lambda/
            - Ref: Function76856677
      RetentionInDays: 150
    Metadata:
      aws:cdk:path: Chapter4Stack/Function/LogRetention/Resource
  FunctionCurrentVersion4E2B2261c53f85652a82d1a08a2c74718982b8a7:
    Type: AWS::Lambda::Version
    Properties:
      FunctionName:
        Ref: Function76856677
    Metadata:
      aws:cdk:path: Chapter4Stack/Function/CurrentVersion/Resource
  LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
        Version: "2012-10-17"
      ManagedPolicyArns:
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    Metadata:
      aws:cdk:path: Chapter4Stack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/Resource
  LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - logs:DeleteRetentionPolicy
              - logs:PutRetentionPolicy
            Effect: Allow
            Resource: "*"
        Version: "2012-10-17"
      PolicyName: LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB
      Roles:
        - Ref: LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB
    Metadata:
      aws:cdk:path: Chapter4Stack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource
  LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aFD4BFC8A:
    Type: AWS::Lambda::Function
    Properties:
      Handler: index.handler
      Runtime: nodejs14.x
      Code:
        S3Bucket: cdk-hnb659fds-assets-507370583167-us-east-1
        S3Key: ae967c277459e8936ac565a71d34ea5dcff7b98e556466c36a4d6da023a2d9aa.zip
      Role:
        Fn::GetAtt:
          - LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB
          - Arn
    DependsOn:
      - LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRoleDefaultPolicyADDA7DEB
      - LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8aServiceRole9741ECFB
    Metadata:
      aws:cdk:path: Chapter4Stack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/Resource
      aws:asset:path: asset.ae967c277459e8936ac565a71d34ea5dcff7b98e556466c36a4d6da023a2d9aa
      aws:asset:is-bundled: false
      aws:asset:property: Code
  AwsCustomResourceRole54BBCF34:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: Chapter4Stack/AwsCustomResourceRole/Resource
  AwsCustomResourceRoleDefaultPolicy4EC1C81B:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action: lambda:InvokeFunction
            Effect: Allow
            Resource: arn:aws:lambda:us-east-1:507370583167:function:*-ResInitChapter4Stack
        Version: "2012-10-17"
      PolicyName: AwsCustomResourceRoleDefaultPolicy4EC1C81B
      Roles:
        - Ref: AwsCustomResourceRole54BBCF34
    Metadata:
      aws:cdk:path: Chapter4Stack/AwsCustomResourceRole/DefaultPolicy/Resource
  AwsCustomResourceCustomResourcePolicyC0817817:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action: lambda:Invoke
            Effect: Allow
            Resource: "*"
        Version: "2012-10-17"
      PolicyName: AwsCustomResourceCustomResourcePolicyC0817817
      Roles:
        - Ref: AwsCustomResourceRole54BBCF34
    DependsOn:
      - MySQLRDSInstance7A115F1C
      - MySQLRDSInstanceSecurityGroupfromChapter4StackEcsClusterDefaultAutoScalingGroupInstanceSecurityGroupC07A8DE23306407E89BC
      - MySQLRDSInstanceSecurityGroupfromChapter4StackFunctionSecurityGroup6DD1AE6D33066BCB0142
      - MySQLRDSInstanceSecurityGroupAB593A47
      - MySQLRDSInstanceSubnetGroup6AE13D8A
    Metadata:
      aws:cdk:path: Chapter4Stack/AwsCustomResource/CustomResourcePolicy/Resource
  AwsCustomResource57FD4BB5:
    Type: Custom::AWS
    Properties:
      ServiceToken:
        Fn::GetAtt:
          - AWS679f53fac002430cb0da5b7982bd22872D164C4C
          - Arn
      Create:
        Fn::Join:
          - ""
          - - '{"service":"Lambda","action":"invoke","parameters":{"FunctionName":"'
            - Ref: Function76856677
            - '","Payload":"{\"params\":{\"config\":{\"credentials_secret_name\":\"chapter-4/rds/my-sql-instance\"}}}"},"physicalResourceId":{"id":"MyRdsInit-AwsSdkCall-'
            - Fn::GetAtt:
                - FunctionCurrentVersion4E2B2261c53f85652a82d1a08a2c74718982b8a7
                - Version
            - ebf91c"}}
      Update:
        Fn::Join:
          - ""
          - - '{"service":"Lambda","action":"invoke","parameters":{"FunctionName":"'
            - Ref: Function76856677
            - '","Payload":"{\"params\":{\"config\":{\"credentials_secret_name\":\"chapter-4/rds/my-sql-instance\"}}}"},"physicalResourceId":{"id":"MyRdsInit-AwsSdkCall-'
            - Fn::GetAtt:
                - FunctionCurrentVersion4E2B2261c53f85652a82d1a08a2c74718982b8a7
                - Version
            - ebf91c"}}
      InstallLatestAwsSdk: true
    DependsOn:
      - AwsCustomResourceCustomResourcePolicyC0817817
      - MySQLRDSInstance7A115F1C
      - MySQLRDSInstanceSecurityGroupfromChapter4StackEcsClusterDefaultAutoScalingGroupInstanceSecurityGroupC07A8DE23306407E89BC
      - MySQLRDSInstanceSecurityGroupfromChapter4StackFunctionSecurityGroup6DD1AE6D33066BCB0142
      - MySQLRDSInstanceSecurityGroupAB593A47
      - MySQLRDSInstanceSubnetGroup6AE13D8A
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: Chapter4Stack/AwsCustomResource/Resource/Default
  AWS679f53fac002430cb0da5b7982bd22872D164C4C:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        S3Bucket: cdk-hnb659fds-assets-507370583167-us-east-1
        S3Key: 6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50.zip
      Role:
        Fn::GetAtt:
          - AwsCustomResourceRole54BBCF34
          - Arn
      Handler: index.handler
      Runtime: nodejs14.x
      Timeout: 600
    DependsOn:
      - AwsCustomResourceRoleDefaultPolicy4EC1C81B
      - AwsCustomResourceRole54BBCF34
    Metadata:
      aws:cdk:path: Chapter4Stack/AWS679f53fac002430cb0da5b7982bd2287/Resource
      aws:asset:path: asset.6dbd112fe448437b3438da4382c72fccbb7d2ee1543db222620d7447fffebc50
      aws:asset:is-bundled: false
      aws:asset:property: Code
  ECSBackendAliasRecord5329205B:
    Type: AWS::Route53::RecordSet
    Properties:
      Name: backend.cas.sh.
      Type: A
      AliasTarget:
        DNSName:
          Fn::Join:
            - ""
            - - dualstack.
              - Fn::GetAtt:
                  - LB8A12904C
                  - DNSName
        HostedZoneId:
          Fn::GetAtt:
            - LB8A12904C
            - CanonicalHostedZoneID
      HostedZoneId: Z02121921778TTILNLBVT
    Metadata:
      aws:cdk:path: Chapter4Stack/ECS/BackendAliasRecord/Resource
  ECSLogGroupD9ADFBBA:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: ecs-logs-chapter-4
      RetentionInDays: 1
    UpdateReplacePolicy: Delete
    DeletionPolicy: Delete
    Metadata:
      aws:cdk:path: Chapter4Stack/ECSLogGroup/Resource
  EcsCluster97242B84:
    Type: AWS::ECS::Cluster
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/Resource
  EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup
      SecurityGroupEgress:
        - CidrIp: 0.0.0.0/0
          Description: Allow all outbound traffic by default
          IpProtocol: "-1"
      Tags:
        - Key: Name
          Value: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup/Resource
  EcsClusterDefaultAutoScalingGroupInstanceSecurityGroupfromChapter4StackLBSecurityGroupFB5D1B8632768655350B962B0B:
    Type: AWS::EC2::SecurityGroupIngress
    Properties:
      IpProtocol: tcp
      Description: Load balancer to target
      FromPort: 32768
      GroupId:
        Fn::GetAtt:
          - EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231
          - GroupId
      SourceSecurityGroupId:
        Fn::GetAtt:
          - LBSecurityGroup8A41EA2B
          - GroupId
      ToPort: 65535
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup/from Chapter4StackLBSecurityGroupFB5D1B86:32768-65535
  EcsClusterDefaultAutoScalingGroupInstanceRole3C026863:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: ec2.amazonaws.com
        Version: "2012-10-17"
      Tags:
        - Key: Name
          Value: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceRole/Resource
  EcsClusterDefaultAutoScalingGroupInstanceRoleDefaultPolicy04DC6C80:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - ecs:DeregisterContainerInstance
              - ecs:RegisterContainerInstance
              - ecs:Submit*
            Effect: Allow
            Resource:
              Fn::GetAtt:
                - EcsCluster97242B84
                - Arn
          - Action:
              - ecs:Poll
              - ecs:StartTelemetrySession
            Condition:
              ArnEquals:
                ecs:cluster:
                  Fn::GetAtt:
                    - EcsCluster97242B84
                    - Arn
            Effect: Allow
            Resource: "*"
          - Action:
              - ecr:GetAuthorizationToken
              - ecs:DiscoverPollEndpoint
              - logs:CreateLogStream
              - logs:PutLogEvents
            Effect: Allow
            Resource: "*"
        Version: "2012-10-17"
      PolicyName: EcsClusterDefaultAutoScalingGroupInstanceRoleDefaultPolicy04DC6C80
      Roles:
        - Ref: EcsClusterDefaultAutoScalingGroupInstanceRole3C026863
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceRole/DefaultPolicy/Resource
  EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3:
    Type: AWS::IAM::InstanceProfile
    Properties:
      Roles:
        - Ref: EcsClusterDefaultAutoScalingGroupInstanceRole3C026863
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceProfile
  EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1:
    Type: AWS::AutoScaling::LaunchConfiguration
    Properties:
      ImageId:
        Ref: SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter
      InstanceType: t2.micro
      IamInstanceProfile:
        Ref: EcsClusterDefaultAutoScalingGroupInstanceProfile2CE606B3
      SecurityGroups:
        - Fn::GetAtt:
            - EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231
            - GroupId
      UserData:
        Fn::Base64:
          Fn::Join:
            - ""
            - - |-
                #!/bin/bash
                echo ECS_CLUSTER=
              - Ref: EcsCluster97242B84
              - |-2
                 >> /etc/ecs/ecs.config
                sudo iptables --insert FORWARD 1 --in-interface docker+ --destination 169.254.169.254/32 --jump DROP
                sudo service iptables save
                echo ECS_AWSVPC_BLOCK_IMDS=true >> /etc/ecs/ecs.config
    DependsOn:
      - EcsClusterDefaultAutoScalingGroupInstanceRoleDefaultPolicy04DC6C80
      - EcsClusterDefaultAutoScalingGroupInstanceRole3C026863
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LaunchConfig
  EcsClusterDefaultAutoScalingGroupASGC1A785DB:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      MaxSize: "1"
      MinSize: "1"
      LaunchConfigurationName:
        Ref: EcsClusterDefaultAutoScalingGroupLaunchConfigB7E376C1
      Tags:
        - Key: Name
          PropagateAtLaunch: true
          Value: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup
      VPCZoneIdentifier:
        - Ref: MyVPCcomputeSubnet1Subnet13EB6C6D
        - Ref: MyVPCcomputeSubnet2SubnetC720E999
        - Ref: MyVPCcomputeSubnet3SubnetAD3DE84C
    UpdatePolicy:
      AutoScalingReplacingUpdate:
        WillReplace: true
      AutoScalingScheduledAction:
        IgnoreUnmodifiedGroupSizeProperties: true
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/ASG
  EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: lambda.amazonaws.com
        Version: "2012-10-17"
      ManagedPolicyArns:
        - Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
      Tags:
        - Key: Name
          Value: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole/Resource
  EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRoleDefaultPolicyA45BF396:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - ec2:DescribeHosts
              - ec2:DescribeInstanceAttribute
              - ec2:DescribeInstanceStatus
              - ec2:DescribeInstances
            Effect: Allow
            Resource: "*"
          - Action: autoscaling:CompleteLifecycleAction
            Effect: Allow
            Resource:
              Fn::Join:
                - ""
                - - "arn:"
                  - Ref: AWS::Partition
                  - :autoscaling:us-east-1:507370583167:autoScalingGroup:*:autoScalingGroupName/
                  - Ref: EcsClusterDefaultAutoScalingGroupASGC1A785DB
          - Action:
              - ecs:DescribeContainerInstances
              - ecs:DescribeTasks
              - ecs:ListTasks
              - ecs:UpdateContainerInstancesState
            Condition:
              ArnEquals:
                ecs:cluster:
                  Fn::GetAtt:
                    - EcsCluster97242B84
                    - Arn
            Effect: Allow
            Resource: "*"
          - Action:
              - ecs:ListContainerInstances
              - ecs:SubmitContainerStateChange
              - ecs:SubmitTaskStateChange
            Effect: Allow
            Resource:
              Fn::GetAtt:
                - EcsCluster97242B84
                - Arn
        Version: "2012-10-17"
      PolicyName: EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRoleDefaultPolicyA45BF396
      Roles:
        - Ref: EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole/DefaultPolicy/Resource
  EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionE17A5F5E:
    Type: AWS::Lambda::Function
    Properties:
      Code:
        ZipFile: |
          import boto3, json, os, time

          ecs = boto3.client('ecs')
          autoscaling = boto3.client('autoscaling')


          def lambda_handler(event, context):
            print(json.dumps(dict(event, ResponseURL='...')))
            cluster = os.environ['CLUSTER']
            snsTopicArn = event['Records'][0]['Sns']['TopicArn']
            lifecycle_event = json.loads(event['Records'][0]['Sns']['Message'])
            instance_id = lifecycle_event.get('EC2InstanceId')
            if not instance_id:
              print('Got event without EC2InstanceId: %s', json.dumps(dict(event, ResponseURL='...')))
              return

            instance_arn = container_instance_arn(cluster, instance_id)
            print('Instance %s has container instance ARN %s' % (lifecycle_event['EC2InstanceId'], instance_arn))

            if not instance_arn:
              return

            task_arns = container_instance_task_arns(cluster, instance_arn)

            if task_arns:
              print('Instance ARN %s has task ARNs %s' % (instance_arn, ', '.join(task_arns)))

            while has_tasks(cluster, instance_arn, task_arns):
              time.sleep(10)

            try:
              print('Terminating instance %s' % instance_id)
              autoscaling.complete_lifecycle_action(
                  LifecycleActionResult='CONTINUE',
                  **pick(lifecycle_event, 'LifecycleHookName', 'LifecycleActionToken', 'AutoScalingGroupName'))
            except Exception as e:
              # Lifecycle action may have already completed.
              print(str(e))


          def container_instance_arn(cluster, instance_id):
            """Turn an instance ID into a container instance ARN."""
            arns = ecs.list_container_instances(cluster=cluster, filter='ec2InstanceId==' + instance_id)['containerInstanceArns']
            if not arns:
              return None
            return arns[0]

          def container_instance_task_arns(cluster, instance_arn):
            """Fetch tasks for a container instance ARN."""
            arns = ecs.list_tasks(cluster=cluster, containerInstance=instance_arn)['taskArns']
            return arns

          def has_tasks(cluster, instance_arn, task_arns):
            """Return True if the instance is running tasks for the given cluster."""
            instances = ecs.describe_container_instances(cluster=cluster, containerInstances=[instance_arn])['containerInstances']
            if not instances:
              return False
            instance = instances[0]

            if instance['status'] == 'ACTIVE':
              # Start draining, then try again later
              set_container_instance_to_draining(cluster, instance_arn)
              return True

            task_count = None

            if task_arns:
              # Fetch details for tasks running on the container instance
              tasks = ecs.describe_tasks(cluster=cluster, tasks=task_arns)['tasks']
              if tasks:
                # Consider any non-stopped tasks as running
                task_count = sum(task['lastStatus'] != 'STOPPED' for task in tasks) + instance['pendingTasksCount']

            if not task_count:
              # Fallback to instance task counts if detailed task information is unavailable
              task_count = instance['runningTasksCount'] + instance['pendingTasksCount']

            print('Instance %s has %s tasks' % (instance_arn, task_count))

            return task_count > 0

          def set_container_instance_to_draining(cluster, instance_arn):
            ecs.update_container_instances_state(
                cluster=cluster,
                containerInstances=[instance_arn], status='DRAINING')


          def pick(dct, *keys):
            """Pick a subset of a dict."""
            return {k: v for k, v in dct.items() if k in keys}
      Role:
        Fn::GetAtt:
          - EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA
          - Arn
      Environment:
        Variables:
          CLUSTER:
            Ref: EcsCluster97242B84
      Handler: index.lambda_handler
      Runtime: python3.9
      Tags:
        - Key: Name
          Value: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup
      Timeout: 310
    DependsOn:
      - EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRoleDefaultPolicyA45BF396
      - EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/Resource
  EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionAllowInvokeChapter4StackEcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopic07BF72D7D2DBA186:
    Type: AWS::Lambda::Permission
    Properties:
      Action: lambda:InvokeFunction
      FunctionName:
        Fn::GetAtt:
          - EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionE17A5F5E
          - Arn
      Principal: sns.amazonaws.com
      SourceArn:
        Ref: EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopicACD2D4A4
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/AllowInvoke:Chapter4StackEcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopic07BF72D7
  EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionTopic8F34E394:
    Type: AWS::SNS::Subscription
    Properties:
      Protocol: lambda
      TopicArn:
        Ref: EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopicACD2D4A4
      Endpoint:
        Fn::GetAtt:
          - EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionE17A5F5E
          - Arn
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/Topic/Resource
  EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopicACD2D4A4:
    Type: AWS::SNS::Topic
    Properties:
      Tags:
        - Key: Name
          Value: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LifecycleHookDrainHook/Topic/Resource
  EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: autoscaling.amazonaws.com
        Version: "2012-10-17"
      Tags:
        - Key: Name
          Value: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LifecycleHookDrainHook/Role/Resource
  EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleDefaultPolicy75002F88:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action: sns:Publish
            Effect: Allow
            Resource:
              Ref: EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopicACD2D4A4
        Version: "2012-10-17"
      PolicyName: EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleDefaultPolicy75002F88
      Roles:
        - Ref: EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LifecycleHookDrainHook/Role/DefaultPolicy/Resource
  EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookFFA63029:
    Type: AWS::AutoScaling::LifecycleHook
    Properties:
      AutoScalingGroupName:
        Ref: EcsClusterDefaultAutoScalingGroupASGC1A785DB
      LifecycleTransition: autoscaling:EC2_INSTANCE_TERMINATING
      DefaultResult: CONTINUE
      HeartbeatTimeout: 300
      NotificationTargetARN:
        Ref: EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookTopicACD2D4A4
      RoleARN:
        Fn::GetAtt:
          - EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B
          - Arn
    DependsOn:
      - EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleDefaultPolicy75002F88
      - EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B
    Metadata:
      aws:cdk:path: Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LifecycleHookDrainHook/Resource
  TaskDefinitionTaskRoleFD40A61D:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: ecs-tasks.amazonaws.com
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: Chapter4Stack/TaskDefinition/TaskRole/Resource
  TaskDefinitionTaskRoleDefaultPolicy282E8624:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action: secretsmanager:GetSecretValue
            Effect: Allow
            Resource:
              Ref: MySQLCredentials5BC70F0C
        Version: "2012-10-17"
      PolicyName: TaskDefinitionTaskRoleDefaultPolicy282E8624
      Roles:
        - Ref: TaskDefinitionTaskRoleFD40A61D
    Metadata:
      aws:cdk:path: Chapter4Stack/TaskDefinition/TaskRole/DefaultPolicy/Resource
  TaskDefinitionB36D86D9:
    Type: AWS::ECS::TaskDefinition
    Properties:
      ContainerDefinitions:
        - Environment:
            - Name: RDS_HOST
              Value:
                Fn::GetAtt:
                  - MySQLRDSInstance7A115F1C
                  - Endpoint.Address
          Essential: true
          Image:
            Fn::Sub: 507370583167.dkr.ecr.us-east-1.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-507370583167-us-east-1:c494ed8cdc17d14b90ba4bf452485da4fc4e31443ffb6b9705d78d5641d103fa
          LogConfiguration:
            LogDriver: awslogs
            Options:
              awslogs-group:
                Ref: ECSLogGroupD9ADFBBA
              awslogs-stream-prefix: chapter4
              awslogs-region: us-east-1
          Memory: 256
          Name: Express
          PortMappings:
            - ContainerPort: 80
              HostPort: 0
              Protocol: tcp
      ExecutionRoleArn:
        Fn::GetAtt:
          - TaskDefinitionExecutionRole8D61C2FB
          - Arn
      Family: Chapter4StackTaskDefinitionC7B0AAE2
      NetworkMode: bridge
      RequiresCompatibilities:
        - EC2
      TaskRoleArn:
        Fn::GetAtt:
          - TaskDefinitionTaskRoleFD40A61D
          - Arn
    Metadata:
      aws:cdk:path: Chapter4Stack/TaskDefinition/Resource
  TaskDefinitionExecutionRole8D61C2FB:
    Type: AWS::IAM::Role
    Properties:
      AssumeRolePolicyDocument:
        Statement:
          - Action: sts:AssumeRole
            Effect: Allow
            Principal:
              Service: ecs-tasks.amazonaws.com
        Version: "2012-10-17"
    Metadata:
      aws:cdk:path: Chapter4Stack/TaskDefinition/ExecutionRole/Resource
  TaskDefinitionExecutionRoleDefaultPolicy1F3406F5:
    Type: AWS::IAM::Policy
    Properties:
      PolicyDocument:
        Statement:
          - Action:
              - ecr:BatchCheckLayerAvailability
              - ecr:BatchGetImage
              - ecr:GetDownloadUrlForLayer
            Effect: Allow
            Resource:
              Fn::Join:
                - ""
                - - "arn:"
                  - Ref: AWS::Partition
                  - :ecr:us-east-1:507370583167:repository/cdk-hnb659fds-container-assets-507370583167-us-east-1
          - Action: ecr:GetAuthorizationToken
            Effect: Allow
            Resource: "*"
          - Action:
              - logs:CreateLogStream
              - logs:PutLogEvents
            Effect: Allow
            Resource:
              Fn::GetAtt:
                - ECSLogGroupD9ADFBBA
                - Arn
        Version: "2012-10-17"
      PolicyName: TaskDefinitionExecutionRoleDefaultPolicy1F3406F5
      Roles:
        - Ref: TaskDefinitionExecutionRole8D61C2FB
    Metadata:
      aws:cdk:path: Chapter4Stack/TaskDefinition/ExecutionRole/DefaultPolicy/Resource
  ServiceD69D759B:
    Type: AWS::ECS::Service
    Properties:
      Cluster:
        Ref: EcsCluster97242B84
      DeploymentConfiguration:
        MaximumPercent: 200
        MinimumHealthyPercent: 50
      EnableECSManagedTags: false
      HealthCheckGracePeriodSeconds: 60
      LaunchType: EC2
      LoadBalancers:
        - ContainerName: Express
          ContainerPort: 80
          TargetGroupArn:
            Ref: LBPublicListenerECSGroupD6A32205
      SchedulingStrategy: REPLICA
      TaskDefinition:
        Ref: TaskDefinitionB36D86D9
    DependsOn:
      - LBPublicListenerECSGroupD6A32205
      - LBPublicListener6E1F3D94
    Metadata:
      aws:cdk:path: Chapter4Stack/Service/Service
  LB8A12904C:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      LoadBalancerAttributes:
        - Key: deletion_protection.enabled
          Value: "false"
      Name: chapter4-lb
      Scheme: internet-facing
      SecurityGroups:
        - Fn::GetAtt:
            - LBSecurityGroup8A41EA2B
            - GroupId
      Subnets:
        - Ref: MyVPCingressSubnet1Subnet826B3239
        - Ref: MyVPCingressSubnet2Subnet1C4FF535
        - Ref: MyVPCingressSubnet3Subnet01F7F4E4
      Type: application
    DependsOn:
      - MyVPCingressSubnet1DefaultRoute284CEB77
      - MyVPCingressSubnet2DefaultRoute6FDE9456
      - MyVPCingressSubnet3DefaultRoute4724FC03
    Metadata:
      aws:cdk:path: Chapter4Stack/LB/Resource
  LBSecurityGroup8A41EA2B:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Automatically created Security Group for ELB Chapter4StackLB4D255CA5
      SecurityGroupIngress:
        - CidrIp: 0.0.0.0/0
          Description: Allow from anyone on port 443
          FromPort: 443
          IpProtocol: tcp
          ToPort: 443
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: Chapter4Stack/LB/SecurityGroup/Resource
  LBSecurityGrouptoChapter4StackEcsClusterDefaultAutoScalingGroupInstanceSecurityGroupC07A8DE23276865535BA064ECB:
    Type: AWS::EC2::SecurityGroupEgress
    Properties:
      GroupId:
        Fn::GetAtt:
          - LBSecurityGroup8A41EA2B
          - GroupId
      IpProtocol: tcp
      Description: Load balancer to target
      DestinationSecurityGroupId:
        Fn::GetAtt:
          - EcsClusterDefaultAutoScalingGroupInstanceSecurityGroup912E1231
          - GroupId
      FromPort: 32768
      ToPort: 65535
    Metadata:
      aws:cdk:path: Chapter4Stack/LB/SecurityGroup/to Chapter4StackEcsClusterDefaultAutoScalingGroupInstanceSecurityGroupC07A8DE2:32768-65535
  LBPublicListener6E1F3D94:
    Type: AWS::ElasticLoadBalancingV2::Listener
    Properties:
      DefaultActions:
        - TargetGroupArn:
            Ref: LBPublicListenerECSGroupD6A32205
          Type: forward
      LoadBalancerArn:
        Ref: LB8A12904C
      Certificates:
        - CertificateArn:
            Ref: Certificate4E7ABB08
      Port: 443
      Protocol: HTTPS
    Metadata:
      aws:cdk:path: Chapter4Stack/LB/PublicListener/Resource
  LBPublicListenerECSGroupD6A32205:
    Type: AWS::ElasticLoadBalancingV2::TargetGroup
    Properties:
      HealthCheckIntervalSeconds: 60
      HealthCheckPath: /health
      HealthCheckProtocol: HTTP
      HealthCheckTimeoutSeconds: 10
      HealthyThresholdCount: 5
      Port: 80
      Protocol: HTTP
      TargetGroupAttributes:
        - Key: stickiness.enabled
          Value: "false"
      TargetType: instance
      UnhealthyThresholdCount: 5
      VpcId:
        Ref: MyVPCAFB07A31
    Metadata:
      aws:cdk:path: Chapter4Stack/LB/PublicListener/ECSGroup/Resource
  CDKMetadata:
    Type: AWS::CDK::Metadata
    Properties:
      Analytics: v2:deflate64:H4sIAAAAAAAA/31U227bMAz9lr6r3tpuw15z6boA2WYkQV8DWqZdNbJk6JIiMPzvo+RrG6BPOryIIg8p3icP35KvN/Bmb3l+upUiS5q9A35iO7TaG46MbMeGo3GiEBwcVqCgRJM0q0nHVoWaiS1Dfp80zzUPhud0xVKfScH3PlPogm5CO+0dHiCTOOkn3cJazQU4odXoHMDjJg3HX3BP9N4bXFhqxJngFHijHBrCg0OXSS8tHBX5UqFybI/cG+EuT0b7OubwqWKjSoPWXukfo7pl9iFplp6fuiR61B2pJg4uk7qXO2EJFsPtY5NjLfUl5JZ0pvWoYGAtOpsswtEyCVWWA3WiUFu4oHlGYwNTe6FKiU6rX17xyN0IyHXEa03Rzaaido66IURga4IpmkrYILVMQJU0O931K55TXRPaKOtAcUyNLoSkyrjUPi+MpqqatbDOiMwPGc3llpnQ5O9E42KHXJs8vhPRPhRtcksRwEFGjFELDPE7iMOrrBuDsYPr5ZVicCXOYww7zXXsbAjbHQcwJbrZxIwOHy1h7s2x79GM3diuYEt2WGsrnDaX0G8mdUnFbHW5Q0f3Ax0kjFkOOMQlv5X0lmY6frYePvL7A9jTGguhxEDnRw1xDkKhmeno3h7NWfDu13WwZeCdthwkzQ/RT8K+E6aMgAblhSIWovRm/JdXrltRIL9wib+1PsWLcwVxrqge6onlRtRDlHfyQdciro8IiAEJ1gmaIsgzkNQ5eutMS2ZR1zIsHbqzJdsy2jqS3slzPxo3VL3PgGf2rq1jzTOxbdmKiNfVuB3jbA74nYkm/yzyEDl0n5ZqSRn3X/Yow3c90mrlUiSLN7uSIv7gEO8P1HVwJfjPu9o7xmPgo+kj23jjKo8UDFQ0R6ZlSueYvNov57ufyd2P5O7m1QpxazyNWIXJrjv/A8Sm3bz8BQAA
    Metadata:
      aws:cdk:path: Chapter4Stack/CDKMetadata/Default
Mappings:
  AWSCloudFrontPartitionHostedZoneIdMap:
    aws:
      zoneId: Z2FDTNDATAQYW2
    aws-cn:
      zoneId: Z3RFFRIM2A3IF5
Outputs:
  FrontendURL:
    Value:
      Fn::GetAtt:
        - WebBucket12880F5B
        - WebsiteURL
  RdsInitFnResponse:
    Value:
      Fn::GetAtt:
        - AwsCustomResource57FD4BB5
        - Payload
  BackendURL:
    Value:
      Fn::GetAtt:
        - LB8A12904C
        - DNSName
Parameters:
  SsmParameterValueawsserviceecsoptimizedamiamazonlinux2recommendedimageidC96584B6F00A464EAD1953AFF4B05118Parameter:
    Type: AWS::SSM::Parameter::Value<AWS::EC2::Image::Id>
    Default: /aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id
  BootstrapVersion:
    Type: AWS::SSM::Parameter::Value<String>
    Default: /cdk-bootstrap/hnb659fds/version
    Description: Version of the CDK Bootstrap resources in this environment, automatically retrieved from SSM Parameter Store. [cdk:skip]
Rules:
  CheckBootstrapVersion:
    Assertions:
      - Assert:
          Fn::Not:
            - Fn::Contains:
                - - "1"
                  - "2"
                  - "3"
                  - "4"
                  - "5"
                - Ref: BootstrapVersion
        AssertDescription: CDK bootstrap stack version 6 required. Please run 'cdk bootstrap' with a recent version of the CDK CLI.
```
9. cdk bootstrap
```
Chapter4Stack: destroying... [1/1]

 ✅  Chapter4Stack: destroyed

[2023-07-22-22:15:44] root@casdev01:/home/cas/AWS-CDK-in-Practice/chapter-4-complete-web-application-deployment-with-aws-cdk/root@casdev01:/home/cas/AWS-CDK-inroot@casdev01:/home/cas/AWS-CDK-in-Practice/croroot@casdev01:/home/cas/AWS-CDK-in-Practice/chapter-4-complete-web-application-deployment-with-aws-cdk/infrastructure# cdk bootstrap
 ⏳  Bootstrapping environment aws://507370583167/us-east-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Using default execution policy of 'arn:aws:iam::aws:policy/AdministratorAccess'. Pass '--cloudformation-execution-policies' to customize.

 ✨ hotswap deployment skipped - no changes were detected (use --force to override)

 ✅  Environment aws://507370583167/us-east-1 bootstrapped (no changes).

```
11. cdk deploy
```
✨  Synthesis time: 8.74s

Chapter4Stack:  start: Building 520c0b6871733d5ef4f4c648bfdbd517a9263e1da4605df2292c13f3ce7e1fda:507370583167-us-east-1
Chapter4Stack:  success: Built 520c0b6871733d5ef4f4c648bfdbd517a9263e1da4605df2292c13f3ce7e1fda:507370583167-us-east-1
Chapter4Stack:  start: Publishing 520c0b6871733d5ef4f4c648bfdbd517a9263e1da4605df2292c13f3ce7e1fda:507370583167-us-east-1
Chapter4Stack:  success: Published 520c0b6871733d5ef4f4c648bfdbd517a9263e1da4605df2292c13f3ce7e1fda:507370583167-us-east-1
This deployment will make potentially sensitive changes according to your current security approval level (--require-approval broadening).
Please confirm you intend to make the following modifications:

IAM Statement Changes
┌───┬──────────────────────────────────────────────┬────────┬──────────────────────────────────────────────┬──────────────────────────────────────────────┬─────────────────────────────────────────────────┐
│   │ Resource                                     │ Effect │ Action                                       │ Principal                                    │ Condition                                       │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${AwsCustomResourceRole.Arn}                 │ Allow  │ sts:AssumeRole                               │ Service:lambda.amazonaws.com                 │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${Custom::CDKBucketDeployment8693BB64968944B │ Allow  │ sts:AssumeRole                               │ Service:lambda.amazonaws.com                 │                                                 │
│   │ 69AAFB0CC9EB8756C/ServiceRole.Arn}           │        │                                              │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${Custom::S3AutoDeleteObjectsCustomResourceP │ Allow  │ sts:AssumeRole                               │ Service:lambda.amazonaws.com                 │                                                 │
│   │ rovider/Role.Arn}                            │        │                                              │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${ECSLogGroup.Arn}                           │ Allow  │ logs:CreateLogStream                         │ AWS:${TaskDefinition/ExecutionRole}          │                                                 │
│   │                                              │        │ logs:PutLogEvents                            │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${EcsCluster.Arn}                            │ Allow  │ ecs:DeregisterContainerInstance              │ AWS:${EcsCluster/DefaultAutoScalingGroup/Ins │                                                 │
│   │                                              │        │ ecs:RegisterContainerInstance                │ tanceRole}                                   │                                                 │
│   │                                              │        │ ecs:Submit*                                  │                                              │                                                 │
│ + │ ${EcsCluster.Arn}                            │ Allow  │ ecs:ListContainerInstances                   │ AWS:${EcsCluster/DefaultAutoScalingGroup/Dra │                                                 │
│   │                                              │        │ ecs:SubmitContainerStateChange               │ inECSHook/Function/ServiceRole}              │                                                 │
│   │                                              │        │ ecs:SubmitTaskStateChange                    │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${EcsCluster/DefaultAutoScalingGroup/DrainEC │ Allow  │ lambda:InvokeFunction                        │ Service:sns.amazonaws.com                    │ "ArnLike": {                                    │
│   │ SHook/Function.Arn}                          │        │                                              │                                              │   "AWS:SourceArn": "${EcsCluster/DefaultAutoSca │
│   │                                              │        │                                              │                                              │ lingGroup/LifecycleHookDrainHook/Topic}"        │
│   │                                              │        │                                              │                                              │ }                                               │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${EcsCluster/DefaultAutoScalingGroup/DrainEC │ Allow  │ sts:AssumeRole                               │ Service:lambda.amazonaws.com                 │                                                 │
│   │ SHook/Function/ServiceRole.Arn}              │        │                                              │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${EcsCluster/DefaultAutoScalingGroup/Instanc │ Allow  │ sts:AssumeRole                               │ Service:ec2.amazonaws.com                    │                                                 │
│   │ eRole.Arn}                                   │        │                                              │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${EcsCluster/DefaultAutoScalingGroup/Lifecyc │ Allow  │ sts:AssumeRole                               │ Service:autoscaling.amazonaws.com            │                                                 │
│   │ leHookDrainHook/Role.Arn}                    │        │                                              │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${EcsCluster/DefaultAutoScalingGroup/Lifecyc │ Allow  │ sns:Publish                                  │ AWS:${EcsCluster/DefaultAutoScalingGroup/Lif │                                                 │
│   │ leHookDrainHook/Topic}                       │        │                                              │ ecycleHookDrainHook/Role}                    │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${Function/ServiceRole.Arn}                  │ Allow  │ sts:AssumeRole                               │ Service:lambda.amazonaws.com                 │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${LogRetentionaae0aa3c5b4d4f87b02d85b201efdd │ Allow  │ sts:AssumeRole                               │ Service:lambda.amazonaws.com                 │                                                 │
│   │ 8a/ServiceRole.Arn}                          │        │                                              │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${MySQLCredentials}                          │ Allow  │ secretsmanager:DescribeSecret                │ AWS:${Function/ServiceRole}                  │                                                 │
│   │                                              │        │ secretsmanager:GetSecretValue                │                                              │                                                 │
│ + │ ${MySQLCredentials}                          │ Allow  │ secretsmanager:GetSecretValue                │ AWS:${TaskDefinition/TaskRole}               │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${TaskDefinition/ExecutionRole.Arn}          │ Allow  │ sts:AssumeRole                               │ Service:ecs-tasks.amazonaws.com              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${TaskDefinition/TaskRole.Arn}               │ Allow  │ sts:AssumeRole                               │ Service:ecs-tasks.amazonaws.com              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${WebBucket.Arn}                             │ Allow  │ s3:DeleteObject*                             │ AWS:${Custom::S3AutoDeleteObjectsCustomResou │                                                 │
│   │ ${WebBucket.Arn}/*                           │        │ s3:GetBucket*                                │ rceProvider/Role.Arn}                        │                                                 │
│   │                                              │        │ s3:List*                                     │                                              │                                                 │
│ + │ ${WebBucket.Arn}                             │ Allow  │ s3:Abort*                                    │ AWS:${Custom::CDKBucketDeployment8693BB64968 │                                                 │
│   │ ${WebBucket.Arn}/*                           │        │ s3:DeleteObject*                             │ 944B69AAFB0CC9EB8756C/ServiceRole}           │                                                 │
│   │                                              │        │ s3:GetBucket*                                │                                              │                                                 │
│   │                                              │        │ s3:GetObject*                                │                                              │                                                 │
│   │                                              │        │ s3:List*                                     │                                              │                                                 │
│   │                                              │        │ s3:PutObject                                 │                                              │                                                 │
│   │                                              │        │ s3:PutObjectLegalHold                        │                                              │                                                 │
│   │                                              │        │ s3:PutObjectRetention                        │                                              │                                                 │
│   │                                              │        │ s3:PutObjectTagging                          │                                              │                                                 │
│   │                                              │        │ s3:PutObjectVersionTagging                   │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ ${WebBucket.Arn}/*                           │ Allow  │ s3:GetObject                                 │ AWS:*                                        │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ *                                            │ Allow  │ logs:DeleteRetentionPolicy                   │ AWS:${LogRetentionaae0aa3c5b4d4f87b02d85b201 │                                                 │
│   │                                              │        │ logs:PutRetentionPolicy                      │ efdd8a/ServiceRole}                          │                                                 │
│ + │ *                                            │ Allow  │ lambda:Invoke                                │ AWS:${AwsCustomResourceRole}                 │                                                 │
│ + │ *                                            │ Allow  │ ecs:Poll                                     │ AWS:${EcsCluster/DefaultAutoScalingGroup/Ins │ "ArnEquals": {                                  │
│   │                                              │        │ ecs:StartTelemetrySession                    │ tanceRole}                                   │   "ecs:cluster": "${EcsCluster.Arn}"            │
│   │                                              │        │                                              │                                              │ }                                               │
│ + │ *                                            │ Allow  │ ecr:GetAuthorizationToken                    │ AWS:${EcsCluster/DefaultAutoScalingGroup/Ins │                                                 │
│   │                                              │        │ ecs:DiscoverPollEndpoint                     │ tanceRole}                                   │                                                 │
│   │                                              │        │ logs:CreateLogStream                         │                                              │                                                 │
│   │                                              │        │ logs:PutLogEvents                            │                                              │                                                 │
│ + │ *                                            │ Allow  │ ec2:DescribeHosts                            │ AWS:${EcsCluster/DefaultAutoScalingGroup/Dra │                                                 │
│   │                                              │        │ ec2:DescribeInstanceAttribute                │ inECSHook/Function/ServiceRole}              │                                                 │
│   │                                              │        │ ec2:DescribeInstanceStatus                   │                                              │                                                 │
│   │                                              │        │ ec2:DescribeInstances                        │                                              │                                                 │
│ + │ *                                            │ Allow  │ ecs:DescribeContainerInstances               │ AWS:${EcsCluster/DefaultAutoScalingGroup/Dra │ "ArnEquals": {                                  │
│   │                                              │        │ ecs:DescribeTasks                            │ inECSHook/Function/ServiceRole}              │   "ecs:cluster": "${EcsCluster.Arn}"            │
│   │                                              │        │ ecs:ListTasks                                │                                              │ }                                               │
│   │                                              │        │ ecs:UpdateContainerInstancesState            │                                              │                                                 │
│ + │ *                                            │ Allow  │ ecr:GetAuthorizationToken                    │ AWS:${TaskDefinition/ExecutionRole}          │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ arn:${AWS::Partition}:autoscaling:us-east-1: │ Allow  │ autoscaling:CompleteLifecycleAction          │ AWS:${EcsCluster/DefaultAutoScalingGroup/Dra │                                                 │
│   │ 507370583167:autoScalingGroup:*:autoScalingG │        │                                              │ inECSHook/Function/ServiceRole}              │                                                 │
│   │ roupName/${EcsClusterDefaultAutoScalingGroup │        │                                              │                                              │                                                 │
│   │ ASGC1A785DB}                                 │        │                                              │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ arn:${AWS::Partition}:ecr:us-east-1:50737058 │ Allow  │ ecr:BatchCheckLayerAvailability              │ AWS:${TaskDefinition/ExecutionRole}          │                                                 │
│   │ 3167:repository/cdk-hnb659fds-container-asse │        │ ecr:BatchGetImage                            │                                              │                                                 │
│   │ ts-507370583167-us-east-1                    │        │ ecr:GetDownloadUrlForLayer                   │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ arn:${AWS::Partition}:s3:::cdk-hnb659fds-ass │ Allow  │ s3:GetBucket*                                │ AWS:${Custom::CDKBucketDeployment8693BB64968 │                                                 │
│   │ ets-507370583167-us-east-1                   │        │ s3:GetObject*                                │ 944B69AAFB0CC9EB8756C/ServiceRole}           │                                                 │
│   │ arn:${AWS::Partition}:s3:::cdk-hnb659fds-ass │        │ s3:List*                                     │                                              │                                                 │
│   │ ets-507370583167-us-east-1/*                 │        │                                              │                                              │                                                 │
├───┼──────────────────────────────────────────────┼────────┼──────────────────────────────────────────────┼──────────────────────────────────────────────┼─────────────────────────────────────────────────┤
│ + │ arn:aws:lambda:us-east-1:507370583167:functi │ Allow  │ lambda:InvokeFunction                        │ AWS:${AwsCustomResourceRole}                 │                                                 │
│   │ on:*-ResInitChapter4Stack                    │        │                                              │                                              │                                                 │
└───┴──────────────────────────────────────────────┴────────┴──────────────────────────────────────────────┴──────────────────────────────────────────────┴─────────────────────────────────────────────────┘
IAM Policy Changes
┌───┬────────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────┐
│   │ Resource                                                                   │ Managed Policy ARN                                                                           │
├───┼────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole} │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole               │
├───┼────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${Custom::S3AutoDeleteObjectsCustomResourceProvider/Role}                  │ {"Fn::Sub":"arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"} │
├───┼────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole}    │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole               │
├───┼────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${Function/ServiceRole}                                                    │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole               │
│ + │ ${Function/ServiceRole}                                                    │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole           │
├───┼────────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────┤
│ + │ ${LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole}                │ arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole               │
└───┴────────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────┘
Security Group Changes
┌───┬─────────────────────────────────────────────────────────────────────┬─────┬─────────────────┬─────────────────────────────────────────────────────────────────────┐
│   │ Group                                                               │ Dir │ Protocol        │ Peer                                                                │
├───┼─────────────────────────────────────────────────────────────────────┼─────┼─────────────────┼─────────────────────────────────────────────────────────────────────┤
│ + │ ${EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup.GroupId} │ In  │ TCP 32768-65535 │ ${LB/SecurityGroup.GroupId}                                         │
│ + │ ${EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup.GroupId} │ Out │ Everything      │ Everyone (IPv4)                                                     │
├───┼─────────────────────────────────────────────────────────────────────┼─────┼─────────────────┼─────────────────────────────────────────────────────────────────────┤
│ + │ ${Function-SecurityGroup.GroupId}                                   │ Out │ Everything      │ Everyone (IPv4)                                                     │
├───┼─────────────────────────────────────────────────────────────────────┼─────┼─────────────────┼─────────────────────────────────────────────────────────────────────┤
│ + │ ${LB/SecurityGroup.GroupId}                                         │ In  │ TCP 443         │ Everyone (IPv4)                                                     │
│ + │ ${LB/SecurityGroup.GroupId}                                         │ Out │ TCP 32768-65535 │ ${EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup.GroupId} │
├───┼─────────────────────────────────────────────────────────────────────┼─────┼─────────────────┼─────────────────────────────────────────────────────────────────────┤
│ + │ ${MySQL-RDS-Instance/SecurityGroup.GroupId}                         │ In  │ TCP 3306        │ ${Function-SecurityGroup.GroupId}                                   │
│ + │ ${MySQL-RDS-Instance/SecurityGroup.GroupId}                         │ In  │ TCP 3306        │ ${EcsCluster/DefaultAutoScalingGroup/InstanceSecurityGroup.GroupId} │
│ + │ ${MySQL-RDS-Instance/SecurityGroup.GroupId}                         │ Out │ Everything      │ Everyone (IPv4)                                                     │
└───┴─────────────────────────────────────────────────────────────────────┴─────┴─────────────────┴─────────────────────────────────────────────────────────────────────┘
(NOTE: There may be security-related changes not in this list. See https://github.com/aws/aws-cdk/issues/1299)

Do you wish to deploy these changes (y/n)? y
Chapter4Stack: deploying... [1/1]
Chapter4Stack: creating CloudFormation changeset...

 ✅  Chapter4Stack

✨  Deployment time: 692.49s

Outputs:
Chapter4Stack.BackendURL = chapter4-lb-1550086194.us-east-1.elb.amazonaws.com
Chapter4Stack.FrontendURL = http://chapter-4-web-bucket1-akemxdjqkl.s3-website-us-east-1.amazonaws.com
Chapter4Stack.RdsInitFnResponse = {"status":"OK","results":[{"fieldCount":0,"affectedRows":0,"insertId":0,"serverStatus":10,"warningCount":0,"message":"","protocol41":true,"changedRows":0},{"fieldCount":0,"affectedRows":0,"insertId":0,"serverStatus":10,"warningCount":0,"message":"","protocol41":true,"changedRows":0},{"fieldCount":0,"affectedRows":1,"insertId":1,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0}]}
Stack ARN:
arn:aws:cloudformation:us-east-1:507370583167:stack/Chapter4Stack/eed92030-2955-11ee-bcbb-0a66f8553bf9

✨  Total time: 701.24s
```
12. https://frontend.cas.sh 

# CDK-nag
* [cdk-nag-walkthrough](https://aws.amazon.com/blogs/devops/manage-application-security-and-compliance-with-the-aws-cloud-development-kit-and-cdk-nag/)
* [cdk-nag-github](https://github.com/cdklabs/cdk-nag)
1. ssh cas@172.18.0.193
2. sudo -i 
3. 
4. vim package.json
* update aws-cdk-lib": "2.34.0" to aws-cdk-lib": "2.78.0"
```
{
  "name": "chapter-4",
  "version": "0.1.0",
  "bin": {
    "chapter-4": "bin/chapter-4.js"
  },
  "scripts": {
    "build:frontend": "cd ../web && yarn install && yarn build",
    "build": "tsc",
    "watch": "tsc -w",
    "test": "jest",
    "cdk": "cdk"
  },
  "devDependencies": {
    "@types/cors": "^2.8.12",
    "@types/express": "^4.17.13",
    "@types/jest": "^27.5.0",
    "@types/node": "10.17.27",
    "@types/prettier": "2.6.0",
    "@types/uuid": "^8.3.4",
    "@typescript-eslint/eslint-plugin": "^5.31.0",
    "@typescript-eslint/parser": "^5.31.0",
    "aws-cdk": "2.34.0",
    "eslint": "^8.20.0",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-import-resolver-typescript": "^3.3.0",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-promise": "^6.0.0",
    "jest": "^27.5.1",
    "prettier": "^2.7.1",
    "ts-jest": "^27.1.4",
    "ts-node": "^10.7.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "~3.9.7"
  },
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.121.0",
    "@aws-sdk/lib-dynamodb": "^3.121.0",
    "aws-cdk-lib": "2.78.0",
    "cdk-nag": "^2.27.79",
    "constructs": "^10.0.0",
    "cors": "^2.8.5",
    "express": "^4.18.1",
    "source-map-support": "^0.5.21",
    "uuid": "^8.3.2"
  }
}
```
5. vim bin/chapter-4.ts 
* add cdk-nag check imports and Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
```
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Chapter3Stack } from '../lib/chapter-4-stack';
// Add cdk-nag checks 
import { AwsSolutionsChecks } from 'cdk-nag'
import { Aspects } from 'aws-cdk-lib';

const app = new cdk.App();
// Add the cdk-nag AwsSolutions Pack with extra verbose logging enabled.
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }))
// Original Chapter4Stack below
new Chapter3Stack(app, 'Chapter4Stack', {
//  env: { region: 'us-east-1', account: process.env.CDK_DEFAULT_ACCOUNT },
    env: { account: '507370583167', region: 'us-east-1' },
});
```
6. npm install cdk-nag
7. cdk synth
```
[WARNING] aws-cdk-lib.aws_ec2.SubnetType#PRIVATE_WITH_NAT is deprecated.
  use `PRIVATE_WITH_EGRESS`
  This API will be removed in the next major release.
[Error at /Chapter4Stack/MyVPC/Resource] AwsSolutions-VPC7: The VPC does not have an associated Flow Log. VPC Flow Logs capture network flow information for a VPC, subnet, or network interface and stores it in Amazon CloudWatch Logs. Flow log data can help customers troubleshoot network issues; for example, to diagnose why specific traffic is not reaching an instance, which might be a result of overly restrictive security group rules.

[Error at /Chapter4Stack/WebBucket/Resource] AwsSolutions-S1: The S3 Bucket has server access logs disabled. The bucket should have server access logging enabled to provide detailed records for the requests that are made to the bucket.

[Error at /Chapter4Stack/WebBucket/Resource] AwsSolutions-S2: The S3 Bucket does not have public access restricted and blocked. The bucket should have public access restricted and blocked to prevent unauthorized access.

[Error at /Chapter4Stack/WebBucket/Resource] AwsSolutions-S5: The S3 static website bucket either has an open world bucket policy or does not use a CloudFront Origin Access Identity (OAI) in the bucket policy for limited getObject and/or putObject permissions. An OAI allows you to provide access to content in your S3 static website bucket through CloudFront URLs without enabling public access through an open bucket policy, disabling S3 Block Public Access settings, and/or through object ACLs.

[Error at /Chapter4Stack/WebBucket/Resource] AwsSolutions-S10: The S3 Bucket or bucket policy does not require requests to use SSL. You can use HTTPS (TLS) to help prevent potential attackers from eavesdropping on or manipulating network traffic using person-in-the-middle or similar attacks. You should allow only encrypted connections over HTTPS (TLS) using the aws:SecureTransport condition on Amazon S3 bucket policies.

[Error at /Chapter4Stack/WebBucket/Policy/Resource] AwsSolutions-S10: The S3 Bucket or bucket policy does not require requests to use SSL. You can use HTTPS (TLS) to help prevent potential attackers from eavesdropping on or manipulating network traffic using person-in-the-middle or similar attacks. You should allow only encrypted connections over HTTPS (TLS) using the aws:SecureTransport condition on Amazon S3 bucket policies.

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:GetBucket*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:GetObject*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:List*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::arn:<AWS::Partition>:s3:::cdk-hnb659fds-assets-507370583167-us-east-1/*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:Abort*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::s3:DeleteObject*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::<WebBucket12880F5B.Arn>/*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/Custom::CDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C/Resource] AwsSolutions-L1: The non-container Lambda function is not configured to use the latest runtime version. Use the latest available runtime for the targeted language to avoid technical debt. Runtimes specific to a language or framework version are deprecated when the version reaches end of life. This rule only applies to non-container Lambda functions.

[Warning at /Chapter4Stack/Frontend-Distribution/Resource] AwsSolutions-CFR1: The CloudFront distribution may require Geo restrictions. Geo restriction may need to be enabled for the distribution in order to allow or deny a country in order to allow or restrict users in specific locations from accessing content.

[Warning at /Chapter4Stack/Frontend-Distribution/Resource] AwsSolutions-CFR2: The CloudFront distribution may require integration with AWS WAF. The Web Application Firewall can help protect against application-layer attacks that can compromise the security of the system or place unnecessary load on them.

[Error at /Chapter4Stack/Frontend-Distribution/Resource] AwsSolutions-CFR3: The CloudFront distribution does not have access logging enabled. Enabling access logs helps operators track all viewer requests for the content delivered through the Content Delivery Network.

[Error at /Chapter4Stack/Frontend-Distribution/Resource] AwsSolutions-CFR5: The CloudFront distributions uses SSLv3 or TLSv1 for communication to the origin. Vulnerabilities have been and continue to be discovered in the deprecated SSL and TLS protocols. Using a security policy with minimum TLSv1.1 or TLSv1.2 and appropriate security ciphers for HTTPS helps protect viewer connections.

[Error at /Chapter4Stack/MySQLCredentials/Resource] AwsSolutions-SMG4: The secret does not have automatic rotation scheduled. AWS Secrets Manager can be configured to automatically rotate the secret for a secured service or database.

[Error at /Chapter4Stack/MySQL-RDS-Instance/Resource] AwsSolutions-RDS2: The RDS instance or Aurora DB cluster does not have storage encryption enabled. Storage encryption helps protect data-at-rest by encrypting the underlying storage, automated backups, read replicas, and snapshots for the database.

[Error at /Chapter4Stack/MySQL-RDS-Instance/Resource] AwsSolutions-RDS3: The non-Aurora RDS DB instance does not have multi-AZ support enabled. Use multi-AZ deployment configurations for high availability and automatic failover support fully managed by AWS.

[Error at /Chapter4Stack/MySQL-RDS-Instance/Resource] AwsSolutions-RDS10: The RDS instance or Aurora DB cluster does not have deletion protection enabled. Enabling Deletion Protection at the cluster level for Amazon Aurora databases or instance level for non Aurora instances helps protect from accidental deletion.

[Error at /Chapter4Stack/MySQL-RDS-Instance/Resource] AwsSolutions-RDS11: The RDS instance or Aurora DB cluster uses the default endpoint port. Port obfuscation (using a non default endpoint port) adds an additional layer of defense against non-targeted attacks (i.e. MySQL/Aurora port 3306, SQL Server port 1433, PostgreSQL port 5432, etc).

[Error at /Chapter4Stack/Function/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/Function/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/AwsCustomResourceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::arn:aws:lambda:us-east-1:507370583167:function:*-ResInitChapter4Stack]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Warning at /Chapter4Stack/AwsCustomResource] installLatestAwsSdk was not specified, and defaults to true. You probably do not want this. Set the global context flag '@aws-cdk/customresources:installLatestAwsSdkDefault' to false to switch this behavior off project-wide, or set the property explicitly to true if you know you need to call APIs that are not in Lambda's built-in SDK version.
[Error at /Chapter4Stack/AwsCustomResource/CustomResourcePolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/AWS679f53fac002430cb0da5b7982bd2287/Resource] AwsSolutions-L1: The non-container Lambda function is not configured to use the latest runtime version. Use the latest available runtime for the targeted language to avoid technical debt. Runtimes specific to a language or framework version are deprecated when the version reaches end of life. This rule only applies to non-container Lambda functions.

[Error at /Chapter4Stack/EcsCluster/Resource] AwsSolutions-ECS4: The ECS Cluster has CloudWatch Container Insights disabled. CloudWatch Container Insights allow operators to gain a better perspective on how the cluster’s applications and microservices are performing.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Action::ecs:Submit*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/InstanceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LaunchConfig] AwsSolutions-EC26: The resource creates one or more EBS volumes that have encryption disabled. With EBS encryption, you aren't required to build, maintain, and secure your own key management infrastructure. EBS encryption uses KMS keys when creating encrypted volumes and snapshots. This helps protect data at rest.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/ASG] AwsSolutions-AS3: The Auto Scaling Group does not have notifications configured for all scaling events. Notifications on EC2 instance launch, launch error, termination, and termination errors allow operators to gain better insights into systems attributes such as activity and health.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole/Resource] AwsSolutions-IAM4[Policy::arn:<AWS::Partition>:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole]: The IAM user, role, or group uses AWS managed policies. An AWS managed policy is a standalone policy that is created and administered by AWS. Currently, many AWS managed policies do not restrict resource scope. Replace AWS managed policies with system specific (customer) managed policies.This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Policy::<policy>' for AWS managed policies. Example: appliesTo: ['Policy::arn:<AWS::Partition>:iam::aws:policy/foo'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/ServiceRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::arn:<AWS::Partition>:autoscaling:us-east-1:507370583167:autoScalingGroup:*:autoScalingGroupName/<EcsClusterDefaultAutoScalingGroupASGC1A785DB>]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/DrainECSHook/Function/Resource] AwsSolutions-L1: The non-container Lambda function is not configured to use the latest runtime version. Use the latest available runtime for the targeted language to avoid technical debt. Runtimes specific to a language or framework version are deprecated when the version reaches end of life. This rule only applies to non-container Lambda functions.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LifecycleHookDrainHook/Topic/Resource] AwsSolutions-SNS2: The SNS Topic does not have server-side encryption enabled. Server side encryption adds additional protection of sensitive data delivered as messages to subscribers.

[Error at /Chapter4Stack/EcsCluster/DefaultAutoScalingGroup/LifecycleHookDrainHook/Topic/Resource] AwsSolutions-SNS3: The SNS Topic does not require publishers to use SSL. Without HTTPS (TLS), a network-based attacker can eavesdrop on network traffic or manipulate it, using an attack such as man-in-the-middle. Allow only encrypted connections over HTTPS (TLS) using the aws:SecureTransport condition and the 'sns: Publish' action in the topic policy to force publishers to use SSL. If SSE is already enabled then this control is auto enforced.

[Error at /Chapter4Stack/TaskDefinition/Resource] AwsSolutions-ECS2: The ECS Task Definition includes a container definition that directly specifies environment variables. Use secrets to inject environment variables during container startup from AWS Systems Manager Parameter Store or Secrets Manager instead of directly specifying plaintext environment variables. Updates to direct environment variables require operators to change task definitions and perform new deployments.

[Error at /Chapter4Stack/TaskDefinition/ExecutionRole/DefaultPolicy/Resource] AwsSolutions-IAM5[Resource::*]: The IAM entity contains wildcard permissions and does not have a cdk-nag rule suppression with evidence for those permission. Metadata explaining the evidence (e.g. via supporting links) for wildcard permissions allows for transparency to operators. This is a granular rule that returns individual findings that can be suppressed with 'appliesTo'. The findings are in the format 'Action::<action>' for policy actions and 'Resource::<resource>' for resources. Example: appliesTo: ['Action::s3:*'].

[Error at /Chapter4Stack/LB/Resource] AwsSolutions-ELB2: The ELB does not have access logs enabled. Access logs allow operators to to analyze traffic patterns and identify and troubleshoot security issues.

[Error at /Chapter4Stack/LB/SecurityGroup/Resource] AwsSolutions-EC23: The Security Group allows for 0.0.0.0/0 or ::/0 inbound access. Large port ranges, when open, expose instances to unwanted attacks. More than that, they make traceability of vulnerabilities very difficult. For instance, your web servers may only require 80 and 443 ports to be open, but not all. One of the most common mistakes observed is when  all ports for 0.0.0.0/0 range are open in a rush to access the instance. EC2 instances must expose only to those ports enabled on the corresponding security group level.


Found errors
```
8. cat cdk.out/AwsSolutions-Chapter4Stack-NagReport.csv

# References
* [regula](https://github.com/fugue/regula)
* [regula.dev](https://regula.dev/getting-started.html#tutorial-run-regula-locally-on-terraform-iac)
* [secureCDK](https://www.fugue.co/blog/securing-an-aws-cdk-app-with-regula-and-openpolicyagent)
* [AWS-CDK-API-Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)

# Notes
The `cdk.json` file tells the CDK Toolkit how to execute your app.

# Useful commands
* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
