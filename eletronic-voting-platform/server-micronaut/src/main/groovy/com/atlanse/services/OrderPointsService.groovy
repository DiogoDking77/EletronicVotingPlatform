package com.atlanse.services

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.OrderPointsEntity
import com.atlanse.domains.VotingEntity
import com.atlanse.domains.VotingTypeEntity
import com.atlanse.dto.CategoryDTO
import com.atlanse.dto.OrderPointsDTO
import com.atlanse.repositories.CategoryRepository
import com.atlanse.repositories.OrderPointsRepository
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
class OrderPointsService {

    @Inject
    OrderPointsRepository orderPointsRepository

    @Inject
    VotingTypeService votingTypeService

    @PersistenceContext
    EntityManager entityManager

    OrderPointsEntity create(OrderPointsDTO orderPointsdto) {
        VotingTypeEntity votingType = votingTypeService.findByID(UUID.fromString(orderPointsdto.votingType))

        OrderPointsEntity orderPoints = new OrderPointsEntity(
                position: orderPointsdto.position,
                points: orderPointsdto.points,
                votingType: votingType
        )

        return orderPointsRepository.save(orderPoints)
    }



    OrderPointsEntity findByID(UUID id) {
        return orderPointsRepository.findById(id).orElse(null)
    }

    Page<OrderPointsEntity> findAll(Pageable pageable) {
        return orderPointsRepository.findAll(pageable)
    }

    OrderPointsEntity update(UUID id, OrderPointsDTO orderPointsdto) {
        OrderPointsEntity orderPoints = orderPointsRepository.findById(id).orElse(null)

        if (orderPoints != null) {
            if (orderPointsdto.position) {
                orderPoints.position = orderPointsdto.position
            }
            if (orderPointsdto.points){
                orderPoints.points = orderPointsdto.points
            }

            if (orderPointsdto.votingType) {
                VotingTypeEntity votingType = votingTypeService.findByID(UUID.fromString(orderPointsdto.votingType))
                orderPoints.votingType = votingType
            }

            orderPointsRepository.update(orderPoints)
            return orderPoints
        }
        return null
    }

    void delete(UUID id) {
        OrderPointsEntity orderPointsToDelete = orderPointsRepository.findById(id).orElse(null)
        if (orderPointsToDelete) {
            orderPointsRepository.delete(orderPointsToDelete)
        }
    }
}
