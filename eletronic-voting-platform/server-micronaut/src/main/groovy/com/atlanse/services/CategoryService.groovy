package com.atlanse.services

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.VotingEntity
import com.atlanse.domains.VotingTypeEntity
import com.atlanse.dto.CategoryDTO
import com.atlanse.repositories.CategoryRepository

import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional
import java.util.UUID

@Slf4j
@Singleton
class CategoryService {

    @Inject
    CategoryRepository categoryRepository

    @Inject
    VotingService votingService

    @PersistenceContext
    EntityManager entityManager

    boolean existsCategoryInVoting(String name, String votingId) {
        UUID votingUuid = UUID.fromString(votingId)
        return categoryRepository.existsCategoryInVoting(name, votingUuid)
    }


    CategoryEntity create(CategoryDTO categorydto) {
        VotingEntity voting = votingService.findByID(UUID.fromString(categorydto.voting))
        if(!existsCategoryInVoting(categorydto.name, categorydto.voting)){
        CategoryEntity category = new CategoryEntity(
                name: categorydto.name,
                information: categorydto.information,
                voting: voting
        )
        return categoryRepository.save(category)
        }
    }



    CategoryEntity findByID(UUID id) {
        return categoryRepository.findById(id).orElse(null)
    }

    Page<CategoryEntity> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable)
    }

    CategoryEntity update(UUID id, CategoryDTO categorydto) {
        CategoryEntity category = categoryRepository.findById(id).orElse(null)

        if (category != null) {
            if (categorydto.name) {
                category.name = categorydto.name
            }
            if (categorydto.information){
                category.information = categorydto.information
            }

            if (categorydto.voting) {
                VotingEntity voting = votingService.findByID(UUID.fromString(categorydto.voting))
                category.voting = voting
            }

            categoryRepository.update(category)
            return category
        }
        return null
    }

    void delete(UUID id) {
        CategoryEntity categoryToDelete = categoryRepository.findById(id).orElse(null)
        if (categoryToDelete) {
            categoryRepository.delete(categoryToDelete)
        }
    }

    List<CategoryEntity> getCategoriesByVoting(UUID votingId) {
        return categoryRepository.findCategoriesByVoting(votingId)
    }

}
