package com.atlanse.controllers

import com.atlanse.domains.InvitedVotingsViewEntity
import com.atlanse.domains.UserEntity
import com.atlanse.domains.VotingEntity
import com.atlanse.domains.VotingsViewEntity
import com.atlanse.domains.VotingsVotedViewEntity
import com.atlanse.dto.LoginDTO
import com.atlanse.dto.UserLoginDTO
import com.atlanse.services.UserService
import com.atlanse.services.VotingService
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import io.micronaut.http.HttpResponse
import io.micronaut.http.annotation.*
import jakarta.inject.Inject

import javax.naming.AuthenticationException

@Slf4j
@Controller("/api/user")
class UserController {

    @Inject
    UserService userService

    @Inject
    VotingService votingService

    @Get("/{id}")
    HttpResponse<UserEntity> getUser(UUID id) {
        UserEntity user = userService.findByID(id)
        if (user) {
            return HttpResponse.ok(user)
        }
        return HttpResponse.notFound()

    }


    @Post("/{userId}/associateWithVoting/{votingId}")
    HttpResponse associateUserWithVoting(UUID userId, UUID votingId) {
        UserEntity user = userService.findByID(userId)

        if (user) {
            userService.associateUserWithVoting(userId, votingId)
            return HttpResponse.ok("User associated with Voting successfully.")
        } else {
            return HttpResponse.notFound()
        }
    }

    @Get("/")
    HttpResponse<Page<UserEntity>> getUsers(Pageable pageable) {
        return HttpResponse.ok(userService.findAll(pageable))
    }

    @Post
    HttpResponse<UserEntity> createUser(@Body UserEntity user_) {
        UserEntity createdUser = userService.create(user_)
        return HttpResponse.created(createdUser)
    }


    @Patch("/{id}")
    HttpResponse<UserEntity> update(UUID id, @Body UserEntity user_) {

        UserEntity updatedUser = userService.update(id, user_)
        if (updatedUser) {
            return HttpResponse.ok(updatedUser)
        } else {
            return HttpResponse.notFound()
        }


    }

    @Delete("/{id}")
    HttpResponse delete(UUID id) {
        if (userService.findByID(id)) {
            userService.delete(id)
            return HttpResponse.noContent()
        } else {
            return HttpResponse.notFound()
        }
    }


    @Get("/findByPhaseId/{phaseId}")
    HttpResponse<Set<UserEntity>> getUsersByPhaseId(UUID phaseId) {
        Set<UserEntity> users = userService.findUsersByPhaseId(phaseId)
        return HttpResponse.ok(users)
    }

    @Get("/{id}/invitedvotings")
    HttpResponse<Set<VotingsViewEntity>> getInvitedVotings(UUID id) {
        Set<VotingsViewEntity> votings = userService.findInvitedVotings(id)
        return HttpResponse.ok(votings)
    }

    @Get("/allvotings")
    HttpResponse<List<VotingsViewEntity>> getAllVotings() {
        List<VotingsViewEntity> votings = userService.findAllVotings()
        return HttpResponse.ok(votings)
    }

    @Get("/{id}/ownervotings")
    HttpResponse<List<VotingsViewEntity>> getOwnerVotings(UUID id) {
        List<VotingsViewEntity> votings = userService.findOwnerVotings(id)
        return HttpResponse.ok(votings)
    }

    @Get("/{id}/votingsvoted")
    HttpResponse<List<VotingsVotedViewEntity>> getVotingsVoted(UUID id) {
        List<VotingsVotedViewEntity> votings = userService.findVotingsVoted(id)
        return HttpResponse.ok(votings)
    }

    @Get("/{id}/invitedvotingsphases")
    HttpResponse<List<InvitedVotingsViewEntity>> getInvitedVotingsAndPhases(UUID id) {
        List<InvitedVotingsViewEntity> votings = userService.findInvitedVotingsAndPhases(id)
        return HttpResponse.ok(votings)
    }

    @Post("/login")
    HttpResponse<LoginDTO> login(@Body LoginDTO loginDTO) {
        try {
            LoginDTO response = userService.login(loginDTO)
            return HttpResponse.ok(response)
        } catch (AuthenticationException e) {
            return HttpResponse.unauthorized().body(new LoginDTO(message: e.message))
        }
    }



}


