/*
public Page<ParticipantsByStatus> getLiveParticipantsByStatus(
        String status,
        String sortDir,
        int page,
        int size
) {

    boolean isApproved = "APPROVED".equalsIgnoreCase(status);

    // ================= PENDING / REJECTED =================
    if (!isApproved) {

        Pageable pageable = PageRequest.of(page, size);

        Page<ParticipantsByStatus> result =
                "asc".equalsIgnoreCase(sortDir)
                        ? participationAdminRepo.findLiveByStatusOrderByModifiedAsc(status, pageable)
                        : participationAdminRepo.findLiveByStatusOrderByModifiedDesc(status, pageable);

        if (result.isEmpty()) return result;

        Map<UUID, List<UUID>> seasonMap = result.stream()
                .collect(Collectors.groupingBy(
                        ParticipantsByStatus::getSeasonId,
                        Collectors.mapping(ParticipantsByStatus::getParticipationId, Collectors.toList())
                ));

        Map<UUID, VoteQuery> metaMap = new HashMap<>();

        for (Map.Entry<UUID, List<UUID>> entry : seasonMap.entrySet()) {
            metaMap.putAll(
                    voteQueryService.getMetaBatch(entry.getValue(), entry.getKey(), null)
            );
        }

        return result.map(p -> {

            VoteQuery meta = metaMap.getOrDefault(
                    p.getParticipationId(),
                    new VoteQuery(0L, 0L, 0, 0, false, false)
            );

            return new ParticipantsByStatusImpl(
                    p.getParticipationId(),
                    p.getParticipantName(),
                    p.getParticipantPhotoUrl(),
                    p.getSeasonName(),
                    p.getSeasonId(),
                    p.getStatus(),
                    0L,
                    0L,
                    meta.isHasVoted(),
                    meta.isHasKilled()
            );
        });
    }

    // ================= APPROVED =================

    List<ParticipantsByStatus> allApproved =
            participationAdminRepo.findAllLiveApproved();

    if (allApproved.isEmpty()) return Page.empty();

    // Group by season
    Map<UUID, List<ParticipantsByStatus>> grouped =
            allApproved.stream()
                    .collect(Collectors.groupingBy(ParticipantsByStatus::getSeasonId));

    List<ParticipantsByStatus> finalList = new ArrayList<>();

    for (Map.Entry<UUID, List<ParticipantsByStatus>> entry : grouped.entrySet()) {

        UUID seasonId = entry.getKey();
        String key = "l:" + seasonId;

        List<ParticipantsByStatus> dbList = entry.getValue();

        for (ParticipantsByStatus p : dbList) {

            String member = p.getParticipationId().toString();

            // score from Redis (default 0)
            Double scoreObj = redis.opsForZSet().score(key, member);
            long score = scoreObj == null ? 0L : scoreObj.longValue();

            finalList.add(new ParticipantsByStatusImpl(
                    p.getParticipationId(),
                    p.getParticipantName(),
                    p.getParticipantPhotoUrl(),
                    p.getSeasonName(),
                    p.getSeasonId(),
                    p.getStatus(),
                    Long.valueOf(score),   // long → Long
                    0L,                   // temp rank
                    false,
                    false
            ));
        }
    }

    // ================= SORTING =================

    if ("asc".equalsIgnoreCase(sortDir)) {
        finalList.sort(
                Comparator.comparing(ParticipantsByStatus::getScore)
                          .thenComparing(ParticipantsByStatus::getParticipantName)
        );
    } else {
        finalList.sort(
                Comparator.comparing(ParticipantsByStatus::getScore).reversed()
                          .thenComparing(ParticipantsByStatus::getParticipantName)
        );
    }

    // ================= ASSIGN RANK =================

    for (int i = 0; i < finalList.size(); i++) {

        ParticipantsByStatus p = finalList.get(i);

        finalList.set(i, new ParticipantsByStatusImpl(
                p.getParticipationId(),
                p.getParticipantName(),
                p.getParticipantPhotoUrl(),
                p.getSeasonName(),
                p.getSeasonId(),
                p.getStatus(),
                p.getScore(),
                Long.valueOf(i + 1),   // rank as Long
                false,
                false
        ));
    }

    // ================= GLOBAL PAGINATION =================

    int start = page * size;

    if (start >= finalList.size()) {
        return Page.empty(PageRequest.of(page, size));
    }

    int end = Math.min(start + size, finalList.size());

    return new PageImpl<>(
            finalList.subList(start, end),
            PageRequest.of(page, size),
            finalList.size()
    );
}
 */