package com.starbag.Supplier_Material_Management_Service.controller;


import com.starbag.Supplier_Material_Management_Service.dto.SupplierDto;
import com.starbag.Supplier_Material_Management_Service.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor


public class SupplierController {

    private final SupplierService service;

    @GetMapping
    public List<SupplierDto> getAll() { return service.getAllSuppliers(); }

    @GetMapping("/{id}")
    public SupplierDto getById(@PathVariable Long id) { return service.getSupplierById(id); }

    @PostMapping
    public SupplierDto create(@RequestBody SupplierDto dto) { return service.createSupplier(dto); }

    @PutMapping("/{id}")
    public SupplierDto update(@PathVariable Long id, @RequestBody SupplierDto dto) {
        return service.updateSupplier(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.deleteSupplier(id); }
}