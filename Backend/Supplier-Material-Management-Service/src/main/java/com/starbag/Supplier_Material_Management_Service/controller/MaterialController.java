package com.starbag.Supplier_Material_Management_Service.controller;


import com.starbag.Supplier_Material_Management_Service.dto.MaterialDto;
import com.starbag.Supplier_Material_Management_Service.service.MaterialService;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/materials")
@RequiredArgsConstructor
public class MaterialController {
    private final MaterialService service;

    @GetMapping
    public List<MaterialDto> getAll() {
        return service.getAllMaterials();
    }

    @GetMapping("/{id}")
    public MaterialDto getById(@PathVariable Long id){
        return service.getMaterialById(id);
    }

    @PostMapping
    public MaterialDto create(@RequestBody MaterialDto dto) {
        return service.createMaterial(dto);
    }

    @PutMapping("/{id}")
    public MaterialDto update(@PathVariable Long id, @RequestBody MaterialDto dto) {
        return service.updateMaterial(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteMaterial(id);
    }


}
