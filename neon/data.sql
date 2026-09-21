-- Prioritize: data exported from Supabase project qxsyjqquhruqgiwrkppb
-- 12 queues, 51 tasks. queue_members and queue_shares were both empty.
--
-- Queues are inserted before tasks because tasks.sub_queue_id references
-- queues(id). queues.parent_task_id points at tasks but has no FK constraint
-- (it didn't in Supabase either), so the cycle is not a problem.
--
-- Idempotent: ON CONFLICT DO NOTHING, so re-running is safe.

BEGIN;

INSERT INTO queues (id, created_at, name, color, palette, parent_task_id, owner_id) VALUES
 ('ac3fc2e8-dd2d-43ec-ac7a-25bf086e9432','2026-03-14 03:41:01.487597+00','gina - Subtasks','#8b5cf6','{#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#a855f7}','c329b437-737b-4448-8f7f-9f1ab3acd8bd','f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('36d1b373-c278-44fe-8df5-870d53936d6a','2026-03-14 03:41:14.224658+00','bob - Subtasks','#8b5cf6','{#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#a855f7}','91c1a654-2510-441f-b421-ed9ea33480d0','f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('e74b4757-7937-432c-977f-454eb14ea235','2026-03-14 04:50:14.709753+00','CS Projects','#b4d582','{#ec4899,#06b6d4,#eab308,#84cc16,#3b82f6,#a855f7}',NULL,'f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('bb31560f-d3e9-4952-a7a4-29f4b1c15fdc','2026-03-23 17:34:31.550197+00','Current Projects','#76e2f6','{#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#a855f7}',NULL,'f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('089935db-47f4-416c-a3e3-bcf89d80f0fa','2026-03-24 05:45:22.190324+00','Study Queue','#b09cde','{#93c5fd,#c4b5fd,#67e8f9,#f9a8d4,#bef264,#fde047}',NULL,'f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('d11c3ecf-f157-4e28-be17-32c3e8b10a96','2026-03-24 05:48:17.668487+00','4/3 CS Retakes - Subtasks','#8b5cf6','{#93c5fd,#c4b5fd,#67e8f9,#f9a8d4,#bef264,#fde047}','de50b6e1-2651-49df-a345-d29702d486cc','f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('c58f549c-d296-436f-9d82-44b8886ad397','2026-03-24 05:51:11.559743+00','4/8 Stochastic Midterm - Subtasks','#8b5cf6','{#93c5fd,#c4b5fd,#67e8f9,#f9a8d4,#bef264,#fde047}','6af64ae3-8aa3-44c8-b4f0-e8f6b346e625','f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('ac434450-78fc-4541-8830-230f3389a385','2026-03-24 05:54:50.629852+00','4/10 Abstract Midterm - Subtasks','#8b5cf6','{#93c5fd,#c4b5fd,#67e8f9,#f9a8d4,#bef264,#fde047}','acddeb78-db74-4461-a076-3294e30e2e69','f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('50df6ce5-8eaf-4bf3-b411-cddb8cca23b9','2026-04-13 18:25:46.054639+00','Abstract Algebra Readings - Subtasks','#8b5cf6','{#f9a8d4,#f0abfc,#fde047,#bef264,#67e8f9,#7dd3fc}','3dac7400-ab5d-43b7-8141-61162f6dc40b','f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('65e06063-19f7-48a3-a3d7-6f3048352283','2026-04-15 00:52:42.851448+00','Espinosa Podcast','#91aedc','{#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#a855f7}',NULL,'f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('afe1cbac-40a4-47b3-b5dc-16e03d3bd2c7','2026-05-04 19:41:20.903012+00','Proficiency Checks','#934761','{#9ED3DC,#FEFD99,#FCB7C7,#CA6180,#C0E1D2,#E5EEE4}',NULL,'f91f770d-1786-4d03-b64f-b3ed3ff305c2'),
 ('70298ea6-917a-48f1-b812-ffeb048e1621','2026-05-13 22:16:08.978546+00','Proficiency Checks','#72BAA9','{#934761,#FFF8EC,#546B41,#99AD7A,#395B64,#E7F6F2}',NULL,'f8f55752-858c-424d-b987-e5fddd55777a')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (id, created_at, title, description, color, sort_order, queue_id, sub_queue_id) VALUES
 ('fdf3c12b-f3e8-429a-b3af-90747602c507','2026-03-24 05:46:01.552576+00','3/30 Religion Paper Outline',NULL,'#f9a8d4',0,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('81004539-c323-4a79-bed8-7a9fa83b4dab','2026-03-24 05:46:13.374814+00','4/2 Religion Essay',NULL,'#bef264',100,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('de50b6e1-2651-49df-a345-d29702d486cc','2026-03-24 05:46:19.662894+00','4/3 CS Retakes',NULL,'#c4b5fd',200,'089935db-47f4-416c-a3e3-bcf89d80f0fa','d11c3ecf-f157-4e28-be17-32c3e8b10a96'),
 ('5503f7e7-3975-4086-a868-7abd6bc11e96','2026-03-24 05:46:25.039471+00','4/6 Public Policy Brief',NULL,'#fde047',300,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('6af64ae3-8aa3-44c8-b4f0-e8f6b346e625','2026-03-24 05:46:31.708097+00','4/8 Stochastic Midterm',NULL,'#f9a8d4',400,'089935db-47f4-416c-a3e3-bcf89d80f0fa','c58f549c-d296-436f-9d82-44b8886ad397'),
 ('acddeb78-db74-4461-a076-3294e30e2e69','2026-03-24 05:46:37.906807+00','4/10 Abstract Midterm',NULL,'#c4b5fd',500,'089935db-47f4-416c-a3e3-bcf89d80f0fa','ac434450-78fc-4541-8830-230f3389a385'),
 ('f5e14c09-1332-42e6-9263-ddd963265131','2026-03-24 05:46:44.275865+00','4/23 Final Paper Presentation',NULL,'#93c5fd',600,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('78576332-3b88-4f7b-b95b-db0f1751d1b2','2026-03-24 05:46:50.05978+00','5/4 Group Religion Presentation',NULL,'#bef264',700,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('84a544e2-2553-4216-871c-00cc1d31a2fb','2026-03-24 05:47:03.438685+00','5/6 Stochastic Midterm',NULL,'#f9a8d4',800,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('45c0424d-ef99-43ac-a24c-b5f35d596946','2026-03-24 05:47:15.081874+00','5/11 CS Retakes',NULL,'#c4b5fd',900,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('600f2301-a1df-4424-8df2-c3e261bb78f3','2026-03-24 05:47:21.907771+00','5/11 Final Religion Paper Due',NULL,'#fde047',1000,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('92b7db74-b52d-4ec3-b27e-b12feb2a7793','2026-03-24 05:47:27.537423+00','5/12 Abstract Final',NULL,'#bef264',1100,'089935db-47f4-416c-a3e3-bcf89d80f0fa',NULL),
 ('db2437da-d376-423a-a2d6-033655f4e69c','2026-04-15 00:53:18.30099+00','Birthright Citizenship',NULL,'#3b82f6',0,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('15a466c9-1273-4216-aa53-eae8a6c34e99','2026-04-15 00:53:36.103607+00','Tupac',NULL,'#eab308',100,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('5b9043d7-4422-47fd-880b-cee068d88887','2026-04-15 00:53:46.642165+00','Iran',NULL,'#f97316',200,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('5d697a26-ca50-4232-b442-6b78cce10f48','2026-04-15 00:53:48.70588+00','Foreign Policy',NULL,'#a855f7',300,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('80479954-8dc1-479d-ae40-f46692594455','2026-04-15 00:53:54.17137+00','Election',NULL,'#eab308',400,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('7c2b70a4-d6ae-4cc0-b515-36677325c4f0','2026-04-15 00:54:04.634496+00','Why Latinos Voted The Way They Did',NULL,'#a855f7',500,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('40fcb360-df2f-4210-a255-a699cb9e67b6','2026-04-22 00:59:08.07569+00','Venezuela',NULL,'#ef4444',600,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('8e4ee896-166e-4bba-9ea2-504b040d62ce','2026-04-22 00:59:35.683843+00','Cuba',NULL,'#3b82f6',700,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('cea79b30-069c-441d-acaf-b970289a8643','2026-04-22 01:00:23.383564+00','Israel-Palestine',NULL,'#22c55e',800,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('90eb773c-fcb6-4ce5-b796-95c3ea820815','2026-04-22 01:00:25.969467+00','Hamas - Oct 7',NULL,'#ef4444',900,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('443a6ea1-9b96-4e48-8e42-cf11c4bdabbe','2026-04-22 01:01:47.775503+00','UFOs',NULL,'#22c55e',1000,'65e06063-19f7-48a3-a3d7-6f3048352283',NULL),
 ('91c1a654-2510-441f-b421-ed9ea33480d0','2026-03-14 03:41:11.693298+00','bob',NULL,'#eab308',0,'ac3fc2e8-dd2d-43ec-ac7a-25bf086e9432','36d1b373-c278-44fe-8df5-870d53936d6a'),
 ('ec6639eb-77a6-4404-97ea-5ded1d2f5f36','2026-03-24 05:55:16.006979+00','Chapter 9 Notes',NULL,'#f9a8d4',200,'ac434450-78fc-4541-8830-230f3389a385',NULL),
 ('471ff740-d279-485b-9acb-5db9a8cc33d7','2026-03-24 05:55:20.118796+00','Chapter 10 Notes',NULL,'#67e8f9',300,'ac434450-78fc-4541-8830-230f3389a385',NULL),
 ('12723b96-2a5a-4691-9ced-bc8deac111a5','2026-03-24 05:55:25.431677+00','Chapter 11 Notes',NULL,'#93c5fd',400,'ac434450-78fc-4541-8830-230f3389a385',NULL),
 ('fe463e0a-8587-4c2f-b9bb-996c08874cb5','2026-03-24 05:55:31.613275+00','Chapter 12 Notes',NULL,'#67e8f9',500,'ac434450-78fc-4541-8830-230f3389a385',NULL),
 ('edb8e4e9-3c3a-4f89-8f8a-611c8a3705e1','2026-03-23 17:34:39.978532+00','Espinosa Website',NULL,'#a855f7',0,'bb31560f-d3e9-4952-a7a4-29f4b1c15fdc',NULL),
 ('ed752fc0-ccc9-42e7-ae47-5671f474f908','2026-03-23 17:34:53.895278+00','LectureTex',NULL,'#f97316',200,'bb31560f-d3e9-4952-a7a4-29f4b1c15fdc',NULL),
 ('060b26c4-55b9-421f-877d-ba42ec6a2e20','2026-03-23 17:35:03.840566+00','WakeMe',NULL,'#eab308',400,'bb31560f-d3e9-4952-a7a4-29f4b1c15fdc',NULL),
 ('1c3a839c-0d8f-4373-b04a-e73913b1d7d2','2026-03-23 17:34:45.390002+00','Prioritize',NULL,'#3b82f6',450,'bb31560f-d3e9-4952-a7a4-29f4b1c15fdc',NULL),
 ('5446e949-30ad-4c10-9fdd-eafb1520dd8a','2026-03-23 17:35:09.097633+00','ChallengeVerse',NULL,'#22c55e',500,'bb31560f-d3e9-4952-a7a4-29f4b1c15fdc',NULL),
 ('35a8725b-a725-483e-a0cc-d88572032def','2026-03-24 05:51:41.454556+00','Chapter 12 Notes',NULL,'#bef264',300,'c58f549c-d296-436f-9d82-44b8886ad397',NULL),
 ('f023d44a-6277-4ac7-ae2e-8d3dc4ec193a','2026-03-24 05:51:46.658114+00','Chapter 13 Notes',NULL,'#c4b5fd',400,'c58f549c-d296-436f-9d82-44b8886ad397',NULL),
 ('8097b030-6a3d-4fa5-a248-f2cdd14b2fd4','2026-03-24 05:51:50.877497+00','Chapter 14 Notes',NULL,'#fde047',500,'c58f549c-d296-436f-9d82-44b8886ad397',NULL),
 ('ac581c6c-900d-4bf9-996a-c081817c004c','2026-03-24 05:51:55.869043+00','Chapter 15 Notes',NULL,'#93c5fd',600,'c58f549c-d296-436f-9d82-44b8886ad397',NULL),
 ('3795097d-c145-45b8-a40f-15a79018d0a7','2026-03-24 05:52:01.624446+00','Chapter 16 Notes',NULL,'#67e8f9',700,'c58f549c-d296-436f-9d82-44b8886ad397',NULL),
 ('157f40c6-8a71-485c-bd97-0f634db87fdc','2026-03-24 05:50:57.137593+00','Lesson 5 Notes',NULL,'#93c5fd',100,'d11c3ecf-f157-4e28-be17-32c3e8b10a96',NULL),
 ('60c70fd4-742a-4f33-808e-5409cb16b078','2026-03-24 05:51:01.484983+00','Lesson 6 Notes',NULL,'#67e8f9',200,'d11c3ecf-f157-4e28-be17-32c3e8b10a96',NULL),
 ('fcbb096c-39e3-4354-9fff-3ded4d39c575','2026-03-25 17:22:25.385385+00','Mini Sentry Mode',NULL,'#3b82f6',125,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('ec1913c9-a6d5-4653-ab16-83bf177cc74e','2026-03-14 04:53:08.21243+00','Parking Bot',NULL,'#84cc16',128.125,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('011b05ed-3aae-43f9-b17a-9afd18ee2020','2026-03-14 04:50:32.090471+00','Linux From Scratch',NULL,'#ec4899',131.25,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('1bf9e656-62c9-42b4-88a7-c7a333f828e7','2026-03-14 04:50:59.723994+00','Wake Me App',NULL,'#a855f7',145.312,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('21b961ec-b62b-4cbb-a8ca-1668181bbfc7','2026-03-14 04:51:11.06988+00','Stock Ticker',NULL,'#84cc16',147.656,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('ac3916c5-a1ff-43da-85d5-701df0d9dd73','2026-03-14 04:51:20.519316+00','Visitor Log',NULL,'#3b82f6',150,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('0d32eedf-7d26-43ed-93e8-7b7b7971c4b1','2026-03-14 04:51:32.851976+00','ChallengeVerse Site',NULL,'#eab308',500,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('7d99027a-2217-4847-9b87-4517b50664c9','2026-03-14 04:52:06.376143+00','Reddit for Shopping',NULL,'#ec4899',550,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('8c7de855-b593-4fb6-aca8-286b2745a0a7','2026-03-14 04:51:51.008547+00','Sims File Optimizer',NULL,'#a855f7',600,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('65a9e770-2142-435f-b45a-a1c5212f722a','2026-03-14 04:52:10.125343+00','Girly MAL',NULL,'#a855f7',800,'e74b4757-7937-432c-977f-454eb14ea235',NULL),
 ('e4cfd656-c1b8-4182-a725-e9b81f3e48b1','2026-04-02 08:15:25.176492+00','JuhiDeck','Cyberdeck running LFS','#3b82f6',900,'e74b4757-7937-432c-977f-454eb14ea235',NULL)
ON CONFLICT (id) DO NOTHING;

COMMIT;
