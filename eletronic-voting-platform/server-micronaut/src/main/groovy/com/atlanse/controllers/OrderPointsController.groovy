package com.atlanse.controllers

import com.atlanse.domains.CategoryEntity
import com.atlanse.domains.OrderPointsEntity
import com.atlanse.dto.CategoryDTO
import com.atlanse.dto.OrderPointsDTO
import com.atlanse.services.CategoryService
import com.atlanse.services.OrderPointsService
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import jakarta.inject.Inject

@Slf4j
@Controller("/api/order_points")
class OrderPointsController {

    @Inject
    OrderPointsService orderPointsService

    @Get("/{id}")
    HttpResponse<OrderPointsEntity> getOrderPoints(UUID id) {
        OrderPointsEntity orderPoints = orderPointsService.findByID(id)
        if (orderPoints) {
            return HttpResponse.ok(orderPoints)
        }
        return HttpResponse.notFound()

    }

    @Get
    HttpResponse<Page<OrderPointsEntity>> getOrdersPoints(Pageable pageable) {
        return HttpResponse.ok(orderPointsService.findAll(pageable))
    }

    @Post
    HttpResponse<OrderPointsEntity> createOrderPoints(@Body OrderPointsDTO orderPointsdto) {
        OrderPointsEntity createdOrderPoints = orderPointsService.create(orderPointsdto)
        return HttpResponse.created(createdOrderPoints)
    }

    @Patch("/{id}")
    HttpResponse<OrderPointsEntity> update(UUID id, @Body OrderPointsDTO orderPointsdto) {

        OrderPointsEntity updatedOrderPoints = orderPointsService.update(id, orderPointsdto)
        if (updatedOrderPoints) {
            return HttpResponse.ok(updatedOrderPoints)
        } else {
            return HttpResponse.notFound()
        }


    }

    @Delete("/{id}")
    HttpResponse delete(UUID id) {
        if (orderPointsService.findByID(id)) {
            orderPointsService.delete(id)
            return HttpResponse.noContent()
        } else {
            return HttpResponse.notFound()
        }
    }
}



