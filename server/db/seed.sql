-- Insert contacts
INSERT INTO contacts (name, email, phone, notes)
VALUES
('Alice Johnson', 'alice.johnson@example.com', '512-111-1001', 'College friend'),
('Bob Smith', 'bob.smith@example.com', '512-111-1002', 'Works in finance'),
('Carol Lee', 'carol.lee@example.com', NULL, 'Neighbor'),
('David Kim', 'david.kim@example.com', '512-111-1004', NULL),
('Emma Davis', 'emma.davis@example.com', '512-111-1005', 'Met at conference'),
('Frank Miller', 'frank.miller@example.com', NULL, NULL),
('Grace Chen', 'grace.chen@example.com', '512-111-1007', 'Gym buddy'),
('Henry Walker', 'henry.walker@example.com', '512-111-1008', 'Old coworker'),
('Isabella Martinez', 'isabella.martinez@example.com', NULL, 'Family friend'),
('Jack Thompson', 'jack.thompson@example.com', '512-111-1010', 'Startup founder');

-- Insert groups
INSERT INTO groups (name)
VALUES
('Friends'),
('Family'),
('Work'),
('Gym');

-- Link contacts to groups
INSERT INTO contact_groups (contact_id, group_id)
VALUES
-- Alice → Friends
(1,1),

-- Bob → Work
(2,3),

-- Carol → Friends + Family
(3,1),
(3,2),

-- David → Work
(4,3),

-- Emma → Work + Friends
(5,3),
(5,1),

-- Frank → no group (edge case)

-- Grace → Gym
(7,4),

-- Henry → Work
(8,3),

-- Isabella → Family
(9,2),

-- Jack → Work + Gym
(10,3),
(10,4);