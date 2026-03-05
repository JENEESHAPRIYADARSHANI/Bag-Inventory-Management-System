package com.starbag.Payment_Management_Service.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.kms.AWSKMS;
import com.amazonaws.services.kms.AWSKMSClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * AWS KMS Configuration
 * Configures AWS KMS client for encrypting/decrypting sensitive payment data
 */
@Configuration
public class AwsKmsConfig {

    @Value("${aws.region:us-east-1}")
    private String awsRegion;

    @Value("${aws.accessKeyId:}")
    private String accessKeyId;

    @Value("${aws.secretAccessKey:}")
    private String secretAccessKey;

    @Bean
    public AWSKMS awsKmsClient() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(
            accessKeyId, 
            secretAccessKey
        );

        return AWSKMSClientBuilder.standard()
            .withRegion(awsRegion)
            .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
            .build();
    }
}
