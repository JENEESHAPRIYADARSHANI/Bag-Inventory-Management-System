package com.starbag.Supplier_Material_Management_Service.service;

import com.starbag.Supplier_Material_Management_Service.dto.MatterialDto;

import java.util.List;

public interface MaterialService {
    List<MatterialDto> getAllMaterials();
    MatterialDto getMaterialById(Long id);
    MatterialDto createMaterial(MatterialDto dto);
    MatterialDto updateMaterial(Long id, MatterialDto dto);
    void deleteMaterial(Long id);
}
