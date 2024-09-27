package com.atlanse.domains

import com.fasterxml.jackson.annotation.JsonFormat
import io.micronaut.core.annotation.NonNull
import io.micronaut.data.annotation.DateCreated
import io.micronaut.data.annotation.DateUpdated

import javax.persistence.Column
import javax.persistence.MappedSuperclass
import javax.validation.constraints.NotBlank
import java.time.LocalDateTime


@MappedSuperclass
abstract class BaseEntity {
    @NonNull
    @NotBlank
    @Column(name = "created_by")
    String createdBy

    @NonNull
    @NotBlank
    @Column(name = "updated_by")
    String updatedBy

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @DateCreated
    @Column(name = "created_at")
    LocalDateTime createdAt

    @DateUpdated
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "updated_at")
    LocalDateTime updatedAt
}