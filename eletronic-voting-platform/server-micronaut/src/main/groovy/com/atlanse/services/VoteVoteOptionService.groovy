package com.atlanse.services


import com.atlanse.domains.VoteInviteEntity
import com.atlanse.domains.VoteOptionEntity
import com.atlanse.domains.VoteVoteOptionEntity
import com.atlanse.dto.VoteVoteOptionDTO
import com.atlanse.repositories.VoteVoteOptionRepository
import groovy.util.logging.Slf4j
import io.micronaut.data.model.Page
import io.micronaut.data.model.Pageable
import jakarta.inject.Inject
import jakarta.inject.Singleton

@Slf4j
@Singleton
class VoteVoteOptionService {

    @Inject
    VoteVoteOptionRepository voteVoteOptionRepository

    @Inject
    VoteInviteService voteInviteService

    @Inject
    VoteOptionService voteOptionService

    VoteVoteOptionEntity create(VoteVoteOptionDTO voteOptiondto) {
        VoteInviteEntity voteInvite = voteInviteService.findByID(UUID.fromString(voteOptiondto.voteInvite))
        VoteOptionEntity voteOption = voteOptionService.findByID(UUID.fromString(voteOptiondto.voteOption))
        VoteVoteOptionEntity voteVoteOption = new VoteVoteOptionEntity(
                position: voteOptiondto.position,
                voteInvite: voteInvite,
                voteOption: voteOption
        )
        return voteVoteOptionRepository.save(voteVoteOption)
    }

    VoteVoteOptionEntity findByID(UUID id) {
        return voteVoteOptionRepository.findById(id).orElse(null)
    }

    Page<VoteVoteOptionEntity> findAll(Pageable pageable) {
        return voteVoteOptionRepository.findAll(pageable)
    }

    VoteVoteOptionEntity update(UUID id, VoteVoteOptionDTO voteVoteOptiondto) {

        VoteVoteOptionEntity voteVoteOption = voteVoteOptionRepository.findById(id).orElse(null)

        if (voteVoteOption != null) {
            if (voteVoteOptiondto.position) {
                voteVoteOption.position = voteVoteOptiondto.position
            }

            if (voteVoteOptiondto.voteInvite) {
                VoteInviteEntity voteInvite = voteInviteService.findByID(UUID.fromString(voteVoteOptiondto.voteInvite))
                voteVoteOption.voteInvite = voteInvite
            }

            if (voteVoteOptiondto.voteOption) {
                VoteOptionEntity voteOption = voteOptionService.findByID(UUID.fromString(voteVoteOptiondto.voteOption))
                voteVoteOption.voteOption = voteOption
            }

            voteVoteOptionRepository.update(voteVoteOption)
            return voteVoteOption
        }

        return null
    }

    void delete(UUID id) {
        VoteVoteOptionEntity voteVoteOptionToDelete = voteVoteOptionRepository.findById(id).orElse(null)
        if (voteVoteOptionToDelete != null) {
            voteVoteOptionRepository.delete(voteVoteOptionToDelete)
        }
    }

    List<VoteVoteOptionEntity> findVoteVoteOptionIdsByUserIdAndPhaseId(UUID userId, UUID phaseId) {
        return voteVoteOptionRepository.findVoteVoteOptionIdsByUserIdAndPhaseId(userId, phaseId)
    }

    List<UUID> findIdVoteByInviteOption(UUID voteInviteId, UUID voteOptionId) {
        return voteVoteOptionRepository.findIdVoteByInviteOption(voteInviteId, voteOptionId)
    }

    void deleteVote(UUID voteInviteId, UUID voteOptionId) {
        List<UUID> ids = findIdVoteByInviteOption(voteInviteId, voteOptionId);

        for (UUID id : ids) {
            VoteVoteOptionEntity voteVoteOptionToDelete = voteVoteOptionRepository.findById(id).orElse(null);
            if (voteVoteOptionToDelete != null) {
                voteVoteOptionRepository.delete(voteVoteOptionToDelete);
            }
        }
    }

    List<UUID> findVotesByInvite(UUID voteInviteId) {
        return voteVoteOptionRepository.findVotesByInvite(voteInviteId)
    }

    boolean deleteVoteByInvite(UUID voteInviteId) {
        List<UUID> ids = findVotesByInvite(voteInviteId);

        if (!ids.isEmpty()) {
            for (UUID id : ids) {
                VoteVoteOptionEntity voteVoteOptionToDelete = voteVoteOptionRepository.findById(id).orElse(null);
                if (voteVoteOptionToDelete != null) {
                    voteVoteOptionRepository.delete(voteVoteOptionToDelete);
                }
            }
            return true;
        }

        return false;
    }



}


