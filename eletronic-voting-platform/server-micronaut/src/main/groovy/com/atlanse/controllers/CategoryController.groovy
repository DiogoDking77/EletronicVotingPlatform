package com.atlanse.controllers

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.UserEntity
import com.atlanse.domains.VotingEntity
import com.atlanse.dto.CategoryDTO
import com.atlanse.services.CategoryService
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import jakarta.inject.Inject

@Slf4j
@Controller("/api/category")
class CategoryController {

    @Inject
    CategoryService categoryService

    @Get("/{id}")
    HttpResponse<CategoryEntity> getCategory(UUID id) {
        CategoryEntity category = categoryService.findByID(id)
        if (category) {
            return HttpResponse.ok(category)
        }
        return HttpResponse.notFound()

    }

    @Get
    HttpResponse<Page<CategoryEntity>> getCategories(Pageable pageable) {
        return HttpResponse.ok(categoryService.findAll(pageable))
    }

    @Post
    HttpResponse<CategoryEntity> createCategory(@Body CategoryDTO categorydto) {
        CategoryEntity createdCategory = categoryService.create(categorydto)
        return HttpResponse.created(createdCategory)
    }

    @Patch("/{id}")
    HttpResponse<CategoryEntity> update(UUID id, @Body CategoryDTO categorydto) {

        CategoryEntity updatedCategory = categoryService.update(id, categorydto)
        if (updatedCategory) {
            return HttpResponse.ok(updatedCategory)
        } else {
            return HttpResponse.notFound()
        }


    }

    @Delete("/{id}")
    HttpResponse delete(UUID id) {
        if (categoryService.findByID(id)) {
            categoryService.delete(id)
            return HttpResponse.noContent()
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/findByVotingId/{votingId}")
    HttpResponse<List<UserEntity>> getCategoriesByVoting(UUID votingId) {
        List<CategoryEntity> categories = categoryService.getCategoriesByVoting(votingId)
        return HttpResponse.ok(categories)
    }

}


