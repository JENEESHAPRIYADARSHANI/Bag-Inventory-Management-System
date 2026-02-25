package com.starbag.Supplier_Material_Management_Service.controller;


import com.starbag.Supplier_Material_Management_Service.dto.SupplierMaterialMappingDto;
import com.starbag.Supplier_Material_Management_Service.service.SupplierMaterialMappingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/supplier-materials")
@RequiredArgsConstructor

public class SupplierMaterialMappingController {
    private final SupplierMaterialMappingService service;

    @GetMapping
    public List<SupplierMaterialMappingDto> getAll(){
        return service.getAllMappings();
    }
    @GetMapping("/{id}")
    public SupplierMaterialMappingDto getById(@PathVariable Long id){
        return service.getMappingById(id);
    }

    @PostMapping
    public SupplierMaterialMappingDto create(@RequestBody SupplierMaterialMappingDto dto) {
        return service.createMapping(dto);
    }

    @PutMapping("/{id}")
    public SupplierMaterialMappingDto update(@PathVariable Long id, @RequestBody SupplierMaterialMappingDto dto) {
        return service.updateMapping(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteMapping(id);
    }
}
