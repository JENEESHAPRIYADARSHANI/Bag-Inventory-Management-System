package com.starbag.logistics_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {
    private String status;
    private String message;
    private String location;
    private String updatedBy;
    private String remarks;

}
