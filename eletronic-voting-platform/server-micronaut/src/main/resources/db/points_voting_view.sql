CREATE VIEW "eletronicVoting".points_voting_view AS
SELECT DISTINCT
    p.id as id_phase,
    vi.id as id_vote,
    u.id as id_user,
    u.name as name_user,
    u.genre as genre,
    u.date_of_birth as date_of_birth,
    u.nationality as nationality,
    u.email as email,
    p.name as name_phase,
    vo.id as id_vote_option,
    vo.name as name_vote_option,
    vo.information as information_vote_option,
    vvo.position as position,
    o.points as points,
    vi.comment as comment,
    vi.vote_date as vote_date
FROM
    "eletronicVoting".vote_invite vi
        JOIN "eletronicVoting".phase p ON vi.phase_id = p.id
        JOIN "eletronicVoting".category c ON p.category_id = c.id
        JOIN "eletronicVoting".voting vg ON c.voting_id = vg.id
        JOIN "eletronicVoting".users u ON vi.user_id = u.id
        JOIN "eletronicVoting".vote_vote_option vvo ON vi.id = vvo.vote_invite_id
        JOIN "eletronicVoting".vote_option vo ON vo.id = vvo.vote_option_id
        JOIN "eletronicVoting".voting_type vt ON p.voting_type_id = vt.id
        JOIN "eletronicVoting".order_points o ON o.voting_type_id = vt.id
WHERE vvo.position = o.position
ORDER BY u.name, vvo.position ASC;




