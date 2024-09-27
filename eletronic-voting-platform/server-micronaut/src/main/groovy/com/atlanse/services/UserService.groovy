package com.atlanse.services

import com.atlanse.domains.InvitedVotingsViewEntity
import com.atlanse.domains.UserEntity
import com.atlanse.domains.VotingEntity
import com.atlanse.domains.VotingsViewEntity
import com.atlanse.domains.VotingsVotedViewEntity
import com.atlanse.dto.LoginDTO
import com.atlanse.dto.UserLoginDTO
import com.atlanse.repositories.InvitedVotingsViewRepository
import com.atlanse.repositories.UserRepository

import com.atlanse.repositories.VotingRepository
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

import javax.naming.AuthenticationException
import javax.persistence.EntityManager
import javax.persistence.NoResultException
import javax.persistence.PersistenceContext
import javax.transaction.Transactional
import java.time.LocalDateTime
import java.time.LocalDate
import java.time.temporal.ChronoUnit


@Slf4j
@Singleton
class UserService {

    @Inject
    UserRepository userRepository

    @Inject
    VotingRepository votingRepository

    @Inject
    InvitedVotingsViewRepository invitedVotingsViewRepository

    @PersistenceContext
    EntityManager entityManager


    UserEntity create(UserEntity user_) {
        validateUserEmail(user_.email)

        if (user_.dateOfBirth.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Birth Date invalid")
        }
        UserEntity user = new UserEntity(
                name: user_.name,
                genre: user_.genre,
                dateOfBirth: user_.dateOfBirth,
                nationality: user_.nationality,
                email: user_.email,
                password: user_.password,
                creationDate: LocalDateTime.now(),
                userRole: user_.userRole,
                deleted: user_.deleted
        )


        return userRepository.save(user)
    }



    UserEntity findByID(UUID id) {
        return userRepository.findById(id).orElse(null)
    }

    Page<UserEntity> findAll(Pageable pageable) {
        return userRepository.findAll(pageable)
    }

    UserEntity update(UUID id, UserEntity user_) {
        UserEntity user = userRepository.findById(id).orElse(null)
        if (user) {

            validateUserEmail(user_.email, id)

            if (user_.name) {
                user.name = user_.name
            }
            if (user_.genre){
                user.genre = user_.genre
            }
            if (user_.dateOfBirth){
                user.dateOfBirth = user_.dateOfBirth
            }
            if (user_.nationality){
                user.nationality = user_.nationality
            }
            if (user_.email){
                user.email = user_.email
            }
            if (user_.password){
                user.password = user_.password
            }
            if (user_.creationDate){
                user.creationDate = user_.creationDate
            }
            if (user_.userRole) {
                user.userRole = user_.userRole
            }
            user.deleted = user_.deleted

            userRepository.update(user)
            return user
        }
        return null
    }

    void delete(UUID id) {
        UserEntity userToDelete = userRepository.findById(id).orElse(null)
        if(userToDelete) {//userRepository.delete(userToDelete)
            userToDelete.deleted = true
            userRepository.update(userToDelete)
        }
    }

    private void validateUserEmail(String email, UUID userId = null) {
        Optional<UserEntity> existingUser = userRepository.findByEmail(email)

        if (existingUser.isPresent() && (userId == null || !existingUser.get().id.equals(userId))) {
            throw new IllegalArgumentException("Email already exists")
        }
    }


    Set<UserEntity> findUsersByPhaseId(UUID phaseId) {
        return userRepository.findUsersByPhaseId(phaseId)
    }

    Set<VotingsViewEntity> findInvitedVotings(UUID userId){
        return userRepository.findInvitedVotings(userId)
    }

    List<VotingsViewEntity> findAllVotings() {
        return userRepository.findAllVotings()
    }

    List<VotingsViewEntity> findOwnerVotings(UUID userId) {
        return userRepository.findOwnerVotings(userId)
    }

    List<VotingsVotedViewEntity> findVotingsVoted(UUID userId) {
        return userRepository.findVotingsVoted(userId)
    }

    List<InvitedVotingsViewEntity> findInvitedVotingsAndPhases(UUID userId){

        return invitedVotingsViewRepository.findInvitedVotingsAndPhases(userId)
    }


    @Transactional
    LoginDTO login(LoginDTO loginDTO) {
        Optional<UserEntity> optionalUser = userRepository.findByEmail(loginDTO.email)
        UserEntity user = optionalUser.orElse(null)

        if (user == null) {
            throw new AuthenticationException("Email not found")
        }

        if (user.deleted == true) {
            throw new AuthenticationException("This user no longer exists")
        }
        else{

            if (user.password == loginDTO.password) {
                return new LoginDTO(id: user.id, userRole: user.userRole, email: user.email, message: "Successful login")
            } else {
                throw new AuthenticationException("User or password invalids")
            }
        }
    }



}