package com.atlanse.controllers


import com.atlanse.domains.VotingTypeEntity
import com.atlanse.services.VotingTypeService
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Delete
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Patch
import io.micronaut.http.annotation.Post
import jakarta.inject.Inject

@Controller("/api/voting_type")
class VotingTypeController {

    @Inject
    VotingTypeService voting_typeService

    @Get("/{id}")
    HttpResponse<VotingTypeEntity> getVotingType(UUID id) {
        return HttpResponse.ok(voting_typeService.findByID(id))
    }

    @Get("/")
    HttpResponse<Page<VotingTypeEntity>> getVotingTypes(Pageable pageable) {
        return HttpResponse.ok(voting_typeService.findAll(pageable))
    }

    @Post
    HttpResponse<VotingTypeEntity> createVotingType(@Body VotingTypeEntity voting_type_) {
        VotingTypeEntity createdVotingType = voting_typeService.create(voting_type_)
        return HttpResponse.created(createdVotingType)
    }

    @Patch("/{id}")
    HttpResponse<VotingTypeEntity> update(UUID id, @Body VotingTypeEntity voting_type_) {

        VotingTypeEntity updatedVotingType = voting_typeService.update(id, voting_type_)
        if (updatedVotingType) {
            return HttpResponse.ok(updatedVotingType)
        } else {
            return HttpResponse.notFound()
        }


    }

    @Delete("/{id}")
    HttpResponse delete(UUID id) {
        voting_typeService.delete(id)
        return HttpResponse.noContent()
    }
}

