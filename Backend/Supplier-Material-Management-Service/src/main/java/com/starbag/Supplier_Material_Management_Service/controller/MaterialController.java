package com.starbag.Supplier_Material_Management_Service.controller;


import com.starbag.Supplier_Material_Management_Service.dto.MaterialDto;
import com.starbag.Supplier_Material_Management_Service.service.MaterialService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
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

}
