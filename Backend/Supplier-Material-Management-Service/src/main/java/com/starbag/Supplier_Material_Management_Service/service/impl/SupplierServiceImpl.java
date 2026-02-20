package com.starbag.Supplier_Material_Management_Service.service.impl;

import com.starbag.Supplier_Material_Management_Service.domain.Supplier;
import com.starbag.Supplier_Material_Management_Service.dto.SupplierDto;
import com.starbag.Supplier_Material_Management_Service.repository.SupplierRepository;
import com.starbag.Supplier_Material_Management_Service.service.SupplierService;
import com.starbag.Supplier_Material_Management_Service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {
    private final SupplierRepository repository;

    @Override
    public List<SupplierDto> getAllSuppliers() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public SupplierDto getSupplierById(Long id) {
        return repository.findById(id).map(this::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
    }

    @Override
    public SupplierDto createSupplier(SupplierDto dto) {
        Supplier supplier = Supplier.builder()
                .name(dto.getName())
                .contactName(dto.getContactName())
                .contactEmail(dto.getContactEmail())
                .contactPhone(dto.getContactPhone())
                .address(dto.getAddress())
                .status(Supplier.Status.valueOf(dto.getStatus().toUpperCase()))
                .build();
        return toDto(repository.save(supplier));
    }

    @Override
    public SupplierDto updateSupplier(Long id, SupplierDto dto) {
        Supplier supplier = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        supplier.setName(dto.getName());
        supplier.setContactName(dto.getContactName());
        supplier.setContactEmail(dto.getContactEmail());
        supplier.setContactPhone(dto.getContactPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setStatus(Supplier.Status.valueOf(dto.getStatus().toUpperCase()));
        return toDto(repository.save(supplier));
    }

    @Override
    public void deleteSupplier(Long id) {
        Supplier supplier = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier not found"));
        repository.delete(supplier);
    }

    private SupplierDto toDto(Supplier supplier) {
        return SupplierDto.builder()
                .id(supplier.getId())
                .name(supplier.getName())
                .contactName(supplier.getContactName())
                .contactEmail(supplier.getContactEmail())
                .contactPhone(supplier.getContactPhone())
                .address(supplier.getAddress())
                .status(supplier.getStatus().name())
                .build();
    }
}
