INSERT INTO users (name, email, password, acct_type) VALUES ('Public User', 'public@example.com', '1234', 'public');
INSERT INTO users (name, email, password, acct_type) VALUES ('Jane Smith', 'jane@example.com', '1234', 'user');
INSERT INTO users (name, email, password, acct_type) VALUES ('Rc Madrilejo', 'rcm@example.com', '1234', 'user');
INSERT INTO users (name, email, password, acct_type) VALUES ('Edmark Arieta', 'earieta@example.com', '1234', 'user');

INSERT INTO file (user_id, file_name, file_type) VALUES (1, 'math_notes.pdf', 'pdf');
INSERT INTO file (user_id, file_name, file_type) VALUES (1, 'history_notes.docx', 'docx');
INSERT INTO file (user_id, file_name, file_type) VALUES (2, 'science_notes.pdf', 'pdf');
INSERT INTO file (user_id, file_name, file_type) VALUES (2, 'geography_notes.pptx', 'pptx');
INSERT INTO file (user_id, file_name, file_type) VALUES (1, 'javascript.txt', 'txt');


INSERT INTO quiz (file_id, user_id, quiz_title, privacy) VALUES (1, 1, 'Math Quiz', 'public');
INSERT INTO quiz (file_id, user_id, quiz_title, privacy) VALUES (2, 1, 'History Quiz', 'public');
INSERT INTO quiz (file_id, user_id, quiz_title, privacy) VALUES (3, 2, 'Science Quiz', 'public');
INSERT INTO quiz (file_id, user_id, quiz_title, privacy) VALUES (4, 2, 'Geography Quiz', 'public');
INSERT INTO quiz (file_id, user_id, quiz_title, privacy) VALUES (5, 1, 'Javascript Handbook A hand crafted markdown document contains all major Javascript topics covered, taken from different sources. Brush Up your JS memory.', 'public');

INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (1, 'What is 2+2?', '["1", "2", "3", "4"]', 'D');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (1, 'What is 3*3?', '["6", "9", "12", "15"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (1, 'What is 10-4?', '["4", "5", "6", "7"]', 'C');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (1, 'What is 12/3?', '["2", "3", "4", "5"]', 'C');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (1, 'What is the square root of 16?', '["2", "4", "6", "8"]', 'B');

INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (2, 'Who was the first president of the United States?', '["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (2, 'In which year did World War I start?', '["1910", "1914", "1918", "1922"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (2, 'Which ancient civilization built the pyramids?', '["Romans", "Greeks", "Egyptians", "Aztecs"]', 'C');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (2, 'Who was known as the Maid of Orléans?', '["Joan of Arc", "Queen Elizabeth I", "Catherine the Great", "Marie Antoinette"]', 'A');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (2, 'Which explorer discovered America?', '["Christopher Columbus", "Ferdinand Magellan", "Marco Polo", "Vasco da Gama"]', 'A');

INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (3, 'What is the chemical symbol for water?', '["O2", "H2O", "CO2", "H2"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (3, 'What planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (3, 'What is the speed of light?', '["3x10^8 m/s", "1x10^6 m/s", "5x10^7 m/s", "2x10^8 m/s"]', 'A');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (3, 'What is the powerhouse of the cell?', '["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (3, 'What is the most abundant gas in Earth’s atmosphere?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'C');

INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (4, 'What is the capital of France?', '["Berlin", "London", "Paris", "Madrid"]', 'C');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (4, 'Which is the longest river in the world?', '["Amazon", "Nile", "Mississippi", "Yangtze"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (4, 'Which continent is the Sahara Desert located?', '["Asia", "Africa", "Australia", "South America"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (4, 'What is the smallest country in the world?', '["Monaco", "Malta", "Vatican City", "San Marino"]', 'C');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (4, 'Which ocean is the largest?', '["Atlantic", "Indian", "Arctic", "Pacific"]', 'D');

INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (5, 'Which of the following is NOT a way to create variables in JavaScript?', '["var", "int", "let", "const"]', 'B');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (5, 'What is the output of the following code snippet? for (var i = 0; i < 7; ++i) { setTimeout(function () { console.log(i); }, 1000); }', '["8 times 8", "0 to 7 in ascending order", "7 times 7", "Compilation Error"]', 'A');
INSERT INTO question (quiz_id, question_text, options, correct_option) VALUES (5, 'Which method is used to join two strings in JavaScript?', '["replace", "slice", "indexOf", "concat"]', 'D');

INSERT INTO result (user_id, quiz_id, score) VALUES (1, 1, 90);
INSERT INTO result (user_id, quiz_id, score) VALUES (1, 2, 85);
INSERT INTO result (user_id, quiz_id, score) VALUES (2, 3, 95);
INSERT INTO result (user_id, quiz_id, score) VALUES (2, 4, 88);