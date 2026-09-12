const SUBJECTS = [
 {id:'all',name:'All subjects',icon:'▦'}, {id:'english',name:'English',icon:'Aa'}, {id:'math',name:'Mathematics',icon:'∑'},
 {id:'russian',name:'Russian · Русский',icon:'Я'}, {id:'kyrgyz',name:'Kyrgyz · Кыргызча',icon:'Ө'},
 {id:'science',name:'Science',icon:'⚗'}, {id:'humanities',name:'Humanities',icon:'◎'}, {id:'global',name:'Global Perspectives',icon:'↗'}
];
const FORMATS = {
 quiz:{name:'Quiz Sprint',icon:'ϟ',description:'Choose an answer and build a streak.',instructions:'Correct answers earn 100 points, plus 20 for each earlier answer in your current streak. Discuss the feedback before moving on.'},
 tug:{name:'Tug of War',icon:'↔',description:'Two teams compete to pull the flag home.',instructions:'Two players answer at the same time on their own side. Each gets a shuffled deck from your question pool. Correct answers pull toward your side; a three-pull lead wins. Add wrong choices to every question.'},
 relay:{name:'Relay Race',icon:'⚑',description:'Pass the challenge and race along the team tracks.',instructions:'Both players answer independently at the same time. Each correct answer advances your hamster. First to as many correct answers as questions in the pool wins. Add wrong choices to every question.'},
 sort:{name:'Sort It Out',icon:'⇄',description:'Send each example to the right category.',instructions:'Read the example and choose its category. Each correct sort earns 100 points. Discuss errors before continuing.'},
 match:{name:'Match Pairs',icon:'▧',description:'Connect terms, meanings, or equivalent expressions.',instructions:'Choose a card on the left, then its partner on the right. Correct pairs stay matched. Find every pair; fewer attempts gives a better result.'},
 order:{name:'Sequence Builder',icon:'①',description:'Rebuild sentences, paragraphs, or worked solutions.',instructions:'Tap tiles in the correct order, then check your sequence. Undo and Clear let you change it. A correct sequence earns 100 points.'},
 board:{name:'Challenge Board',icon:'▦',description:'Explore your own questions and collect treasure points.',instructions:'Both players explore their own shuffled deck simultaneously. Correct answers collect the question’s treasure points. After both decks are finished, highest points wins. Add wrong choices to every question.'},
 wager:{name:'Confidence Quest',icon:'◆',description:'Back your answer with a carefully chosen wager.',instructions:'Start with 300 points. Read the question and wager 50, 100, or 150 points. Correct answers add the wager; incorrect answers subtract it. Scores cannot fall below zero.'},
 survival:{name:'Three-Life Challenge',icon:'♥',description:'Finish the deck with your three lives intact.',instructions:'The class has three lives. Correct answers earn 100 points; each incorrect answer costs one life. Finish the deck before losing all three.'},
 clue:{name:'Clue Detective',icon:'⌕',description:'Solve the mystery using as few hints as possible.',instructions:'Agree on an answer aloud. Reveal a hint if needed: a hinted answer earns 50 points instead of 100. Reveal the answer and let the teacher mark it.'}
};
const GAMES=[];
// Each line: prompt ~ answer ~ distractors separated by / ~ hint.
// Sequences use | between steps. Prepared content is editable in the teacher form.
function lesson(subject,grade,format,title,topic,content){
 const items=content.trim().split('\n').map(line=>{const [prompt,answer,choices='',hint='']=line.split('~').map(s=>s.trim());return {prompt,answer,options:choices?choices.split(' / ').map(s=>s.trim()):[],hint,explanation:''};});
 GAMES.push({id:`${subject}-${grade}-${format}`,subject,grade,format,title,topic,minutes:format==='board'?'15–20':'8–12',items});
}
lesson('english',7,'quiz','Vocabulary Sprint','Meaning in context',`
The path was treacherous after the storm. What does treacherous mean? ~ dangerous ~ comfortable / familiar / short ~ Think about a slippery path.
Mira was reluctant to speak. She was… ~ unwilling ~ excited / unable to hear / confident
The instructions were precise. They were… ~ exact ~ lengthy / confusing / optional
The village had abundant water. It had… ~ plenty of water ~ no water / dirty water / expensive water
His reply was brief. It was… ~ short ~ rude / loud / late
The explorer was courageous. She was… ~ brave ~ careless / tired / famous
`);
lesson('english',8,'quiz','Inference Sprint','Reading between the lines',`
Aida checked the clock repeatedly and tapped her foot. What is most likely? ~ She is impatient. ~ She is asleep. / She is delighted. / She cannot tell time.
The audience stood and applauded as the last note faded. What does this suggest? ~ They appreciated the performance. ~ They could not hear. / The show was cancelled. / They were rehearsing.
A wet umbrella stood by the door. What can you reasonably infer? ~ Someone recently came in from the rain. ~ It always rains here. / The owner hates umbrellas. / The door is broken.
He said “Fine,” but crossed his arms and looked away. He may be… ~ unhappy ~ enthusiastic / hungry / asleep
The shelves were bare and the shopkeeper sighed. What is plausible? ~ The shop has little stock left. ~ The shop sells only books. / The owner won a prize. / The shop is newly painted.
Her hands shook before the speech, although she had practised. She likely felt… ~ nervous ~ bored / angry / indifferent
`);
lesson('english',7,'tug','Grammar Tug of War','Agreement and verb forms',`
Neither of the boys ___ ready. ~ is ~ are / were / be
She ___ to school every day. ~ walks ~ walk / walking / have walked
They ___ football when it began to rain. ~ were playing ~ was playing / plays / is playing
I have ___ my homework. ~ finished ~ finish / finishing / finishes
There ___ three books on the desk. ~ are ~ is / be / was
If it rains, we ___ indoors. ~ will stay ~ stayed / stays / has stayed
`);
lesson('english',8,'tug','Sentence Tug of War','Clauses and punctuation',`
Choose the correctly punctuated sentence. ~ Although it rained, we played. ~ Although, it rained we played. / Although it rained we, played. / Although it, rained we played.
Which is a complete sentence? ~ Because it was late, we left. ~ Because it was late. / Running down the street. / After the final lesson.
The book ___ I borrowed is excellent. ~ that ~ who / where / whose
Which joins two independent clauses correctly? ~ I was tired; I went home. ~ I was tired, I went home. / I was tired I went home. / I was; tired I went home.
Choose the passive voice. ~ The bridge was built in 1990. ~ They built the bridge in 1990. / They are building a bridge. / They will build a bridge.
If I had more time, I ___ another book. ~ would read ~ will reads / read yesterday / have reading
`);
lesson('english',7,'relay','Paraphrase Relay','Keep the meaning',`
Paraphrase: The journey was delayed because of heavy snow. ~ Heavy snow made the journey start late. ~ The journey caused snow. / The journey was cancelled forever. / Light snow made it faster.
Paraphrase: Regular exercise can improve concentration. ~ Exercising often may help you focus. ~ Exercise guarantees perfect marks. / Concentration prevents exercise. / Only athletes can concentrate.
Paraphrase: The library is open to everyone. ~ Anyone may use the library. ~ Only teachers may enter. / Every library is open all night. / Everyone owns a library.
Paraphrase: Nina prefers reading to watching television. ~ Nina likes reading more than TV. ~ Nina never watches TV. / Nina dislikes all books. / Nina prefers TV to books.
Paraphrase: The team succeeded despite several setbacks. ~ The team achieved its goal even with difficulties. ~ The team failed because it was easy. / The team had no problems. / The team refused to begin.
Paraphrase: Submit your work before Friday. ~ Hand in your work earlier than Friday. ~ Submit it on Saturday. / Do not submit your work. / Friday is the earliest possible day.
`);
lesson('english',8,'relay','Evidence Relay','Claims and evidence',`
Claim: The new bus route saves time. Which evidence is strongest? ~ Average journeys fell from 40 to 25 minutes. ~ The buses are blue. / A driver likes music. / The route has a name.
Claim: The character is generous. Which detail supports it? ~ She shares her lunch with someone who has none. ~ She wears red. / She arrives at eight. / She knows the route.
Claim: The garden attracts wildlife. Choose relevant evidence. ~ Observers counted twelve bird species there. ~ The fence was painted. / The gardener has a bicycle. / The gate is old.
Claim: The narrator feels isolated. Choose supporting language. ~ No one noticed when I left. ~ We laughed together. / My friends welcomed me. / Everyone called my name.
Claim: The article is balanced. What supports it? ~ It includes reasons from supporters and critics. ~ It uses large letters. / It has no paragraphs. / It repeats one opinion.
Claim: The experiment is repeatable. What supports this? ~ Other groups used the same method and got similar results. ~ The scientist has a nice desk. / The report is colourful. / The title is short.
`);
lesson('english',7,'sort','Fact or Opinion?','Recognising statements',`
A triangle has three sides. ~ Fact ~ Opinion
Summer is the best season. ~ Opinion ~ Fact
Bishkek is the capital of Kyrgyzstan. ~ Fact ~ Opinion
This story is more exciting than any other. ~ Opinion ~ Fact
There are seven days in a week. ~ Fact ~ Opinion
Everyone should enjoy poetry. ~ Opinion ~ Fact
`);
lesson('english',8,'sort','Figurative Language Lab','Simile, metaphor and personification',`
Her smile was like sunshine. ~ Simile ~ Metaphor / Personification
The classroom was a zoo. ~ Metaphor ~ Simile / Personification
The wind whispered through the trees. ~ Personification ~ Simile / Metaphor
He ran as fast as lightning. ~ Simile ~ Metaphor / Personification
Time is a thief. ~ Metaphor ~ Simile / Personification
The tired old house groaned in the storm. ~ Personification ~ Simile / Metaphor
`);
lesson('english',7,'match','Word Partners','Synonyms',`
ancient ~ very old
enormous ~ huge
rapid ~ fast
silent ~ quiet
assist ~ help
purchase ~ buy
`);
lesson('english',8,'match','Literary Connections','Literary terms',`
The central idea or main message ~ theme
A contrast between expectation and reality ~ irony
A hint about a later event ~ foreshadowing
The perspective from which a story is told ~ point of view
A struggle between opposing forces ~ conflict
A reference to another text, person, or event ~ allusion
`);
lesson('english',7,'order','Sentence Builder','Building clear sentences',`
Begin with Although. ~ Although it was raining,|we decided|to walk|to school.
Begin with The students. ~ The students|worked together|to solve|the difficult problem.
Begin with the time clause. ~ After the lesson ended,|Mira packed|her books|and went home.
Begin with Every morning. ~ Every morning,|my brother|feeds|the cat.
Begin with Because. ~ Because the bus was late,|we arrived|after|the bell.
Put the question in order. ~ Why|did|the character|leave the village?
`);
lesson('english',8,'order','Paragraph Architect','Cohesion and argument',`
Arrange claim, explanation, example, conclusion. ~ Schools should provide reading time.|Regular reading builds vocabulary.|For example, novels introduce words in context.|Therefore, daily reading benefits learners.
Arrange the events chronologically. ~ First, we planned the experiment.|Next, we collected the equipment.|Then, we recorded the results.|Finally, we wrote our conclusion.
Arrange the contrast logically. ~ Some people prefer studying alone.|They value a quiet environment.|However, others learn through discussion.|Both approaches can be useful.
Arrange cause and effect. ~ Heavy rain fell for days.|As a result, the river rose.|The bridge was then closed.|Consequently, drivers used another route.
Arrange an evidence-based interpretation. ~ The character appears lonely.|The narrator says, “No one noticed me.”|This suggests a lack of connection.|The detail supports the theme of isolation.
Arrange the problem and solution. ~ Litter was building up in the park.|The school organised a cleanup.|Volunteers collected ten bags of rubbish.|The park became safer for wildlife.
`);
lesson('english',7,'board','Story Challenge Board','Character, setting and plot',`
What is the setting of a story? ~ The time and place in which the story happens.
What is a protagonist? ~ The main character of a story.
What is a conflict? ~ A struggle or problem faced by a character.
Name one way an author can reveal character. ~ Through actions, dialogue, thoughts, appearance, or others’ reactions.
What is the climax of a story? ~ The point of greatest tension or a decisive turning point.
How does a first-person narrator usually refer to themselves? ~ Using I or we.
`);
lesson('english',8,'board','Argument Challenge Board','Persuasive writing',`
What is a counterargument? ~ An argument that challenges or opposes your claim.
Why acknowledge a counterargument? ~ To address opposing views and strengthen a reasoned argument.
Give a rhetorical question about litter. ~ For example: Do we really want our parks covered in rubbish?
How are a claim and evidence different? ~ A claim is a position; evidence is information used to support it.
What is a rebuttal? ~ A reasoned response that challenges an opposing argument.
Why does source reliability matter? ~ Inaccurate evidence may weaken an argument.
`);
lesson('english',7,'wager','Punctuation Stakes','Apostrophes and sentence endings',`
Choose the contraction for it is. ~ it's ~ its / its’ / it,s
Choose the possessive for one girl. ~ the girl's bag ~ the girls bag / the girls’ bags / the girl bag
Which punctuation ends a direct question? ~ ? ~ . / ; / ,
Choose the correct list. ~ We bought apples, pears, and plums. ~ We bought, apples pears and plums. / We bought apples pears, and, plums. / We bought apples; pears; and; plums.
Which uses an apostrophe correctly? ~ We don't need a ticket. ~ We dont’ need a ticket. / We do’nt need a ticket. / We dont need a ticket.
Choose a possessive for several teachers. ~ the teachers' room ~ the teacher's room / the teachers room / the teacher room
`);
lesson('english',8,'wager','Tone Tracker','Tone and purpose',`
“What a magnificent view!” The tone is… ~ admiring ~ hostile / indifferent / suspicious
“Another delay. Just what we needed.” The tone is… ~ sarcastic ~ grateful / solemn / objective
A recipe gives step-by-step directions. Its purpose is to… ~ instruct ~ persuade / criticise / mourn
“We deeply regret the inconvenience.” The tone is… ~ apologetic ~ playful / triumphant / threatening
A poster asks readers to join a cleanup. Its purpose is to… ~ persuade ~ record history / define a word / tell a fictional story
“The sample weighed 12 grams.” The tone is… ~ objective ~ furious / romantic / mocking
`);
lesson('english',7,'survival','Grammar Guardians','Common language errors',`
Choose the correct sentence. ~ She and I went home. ~ Her and me went home. / Her and I went home. / She and me went home.
We have ___ apples than yesterday. ~ fewer ~ less / little / much
The dog wagged ___ tail. ~ its ~ it's / its’ / it
She speaks English ___. ~ well ~ good / bestly / nice
They ___ at the museum yesterday. ~ were ~ was / are / be
I am taller ___ my brother. ~ than ~ then / that / when
`);
lesson('english',8,'survival','Editing Escape','Revision and precision',`
Choose the concise phrase. ~ because ~ due to the fact that / in light of the fact that / for the reason that
Which modifier clearly refers to the person walking? ~ Walking to school, I saw a rainbow. ~ Walking to school, a rainbow appeared. / Walking to school, the rain was heavy. / Walking to school, the bag was heavy.
Choose parallel structure. ~ She likes reading, swimming, and cycling. ~ She likes reading, to swim, and cycles. / She likes to read, swimming, and cycles. / She likes reads, swim, and cycling.
Choose a precise verb for moved very slowly and quietly. ~ crept ~ sprinted / flew / shouted
Choose a comparative adjective: Of these two plans, this is ___. ~ better ~ best / more better / most better
Choose a complete sentence. ~ The results were surprising. ~ Despite the surprising results. / Because of the results. / Such surprising results.
`);
lesson('english',7,'clue','Word Detective','Word families and meanings',`
I mean not possible. ~ impossible ~~ I begin with im-.
I am a person who writes books. ~ author ~~ My first letter is a.
I mean the opposite of generous. ~ selfish ~~ Thinking mainly of oneself.
I am a conclusion based on clues. ~ inference ~~ I begin with in- and end in -ference.
I am a word that describes a noun. ~ adjective ~~ Bright and careful are examples.
I join words or clauses, like and or but. ~ conjunction ~~ My name begins with con-.
`);
lesson('english',8,'clue','Literary Detective','Interpreting techniques',`
I give human qualities to non-human things. ~ personification ~~ The wind whispered.
I compare two things using like or as. ~ simile ~~ As quiet as a mouse.
I compare two things directly, without like or as. ~ metaphor ~~ The world is a stage.
I repeat initial consonant sounds. ~ alliteration ~~ Silver snakes slid silently.
I exaggerate for effect. ~ hyperbole ~~ I have told you a million times.
I am a sound-imitating word. ~ onomatopoeia ~~ Buzz, hiss, and bang are examples.
`);
lesson('math',7,'quiz','Integer Sprint','Operations with integers',`
−8 + 13 = ? ~ 5 ~ −5 / 21 / −21
6 − (−4) = ? ~ 10 ~ 2 / −10 / −2
−7 × 3 = ? ~ −21 ~ 21 / −4 / −10
−24 ÷ (−6) = ? ~ 4 ~ −4 / 18 / −18
−3 + (−9) = ? ~ −12 ~ 12 / 6 / −6
5 − 2 × 4 = ? ~ −3 ~ 12 / 3 / −12 ~ Multiply before subtracting.
`);
lesson('math',8,'quiz','Power Sprint','Powers and roots',`
2⁵ = ? ~ 32 ~ 10 / 16 / 64
√144 = ? ~ 12 ~ 72 / 14 / 24
3² × 3³ = ? ~ 3⁵ ~ 3⁶ / 9⁵ / 3¹
5⁰ = ? ~ 1 ~ 0 / 5 / −5
2⁻³ = ? ~ 0.125 ~ −8 / 8 / −6
√0.81 = ? ~ 0.9 ~ 0.09 / 0.81 / 9
`);
lesson('math',7,'tug','Equation Tug of War','One- and two-step equations',`
x + 7 = 19. Find x. ~ 12 ~ 26 / −12 / 7
3x = 24. Find x. ~ 8 ~ 21 / 27 / 72
2x + 5 = 17. Find x. ~ 6 ~ 11 / 12 / 4
x ÷ 4 = 6. Find x. ~ 24 ~ 1.5 / 10 / 2
5x − 3 = 22. Find x. ~ 5 ~ 4 / 19 / 25
4 − x = 9. Find x. ~ −5 ~ 5 / 13 / −13
`);
lesson('math',8,'tug','Algebra Tug of War','Equations with brackets',`
3(x + 2) = 21. Find x. ~ 5 ~ 7 / 9 / 3
5x − 7 = 2x + 8. Find x. ~ 5 ~ 3 / 1 / 15
2(3x − 1) = 22. Find x. ~ 4 ~ 8 / 3 / 6
x ÷ 3 + 4 = 9. Find x. ~ 15 ~ 5 / 27 / 13
4(x − 2) = 2x + 6. Find x. ~ 7 ~ 1 / 3 / 14
7 − 2x = 19. Find x. ~ −6 ~ 6 / 13 / −13
`);
lesson('math',7,'relay','Ratio Relay','Ratio and proportion',`
Simplify 12:18. ~ 2:3 ~ 3:2 / 4:9 / 6:9
Divide 30 in the ratio 2:3. Find the smaller share. ~ 12 ~ 10 / 15 / 18
3 notebooks cost 90 som. What do 5 cost at the same rate? ~ 150 som ~ 120 som / 180 som / 300 som
2 cups of flour make 8 cakes. How much for 20 cakes? ~ 5 cups ~ 4 cups / 6 cups / 10 cups
On a plan, 1 cm represents 4 m. What does 7 cm represent? ~ 28 m ~ 11 m / 1.75 m / 3 m
Red:blue beads = 3:5. There are 24 red. How many blue? ~ 40 ~ 15 / 32 / 64
`);
lesson('math',8,'relay','Linear Relay','Gradient and straight lines',`
For y = 3x + 2, find y when x = 4. ~ 14 ~ 12 / 9 / 18
What is the gradient of y = −2x + 5? ~ −2 ~ 5 / 2 / −5
What is the y-intercept of y = 4x − 7? ~ −7 ~ 4 / 7 / −4
Find the gradient between (1, 3) and (3, 7). ~ 2 ~ 4 / 0.5 / 3
Which point lies on y = 2x + 1? ~ (3, 7) ~ (3, 6) / (2, 3) / (1, 4)
A line has gradient 5 and y-intercept 2. Its equation is… ~ y = 5x + 2 ~ y = 2x + 5 / y = 7x / x = 5y + 2
`);
lesson('math',7,'sort','Number Sorter','Positive, negative and zero',`
−4 + 9 ~ Positive ~ Negative / Zero
3 − 8 ~ Negative ~ Positive / Zero
−6 + 6 ~ Zero ~ Positive / Negative
−2 × (−5) ~ Positive ~ Negative / Zero
12 ÷ (−3) ~ Negative ~ Positive / Zero
7 × 0 ~ Zero ~ Positive / Negative
`);
lesson('math',8,'sort','Number System Sorter','Rational or irrational',`
√49 ~ Rational ~ Irrational
√2 ~ Irrational ~ Rational
0.125 ~ Rational ~ Irrational
π ~ Irrational ~ Rational
0.333… (3 repeats forever) ~ Rational ~ Irrational
√10 ~ Irrational ~ Rational
`);
lesson('math',7,'match','Fraction Connections','Equivalent fractions and decimals',`
1/2 ~ 0.5
1/4 ~ 0.25
3/4 ~ 0.75
1/5 ~ 0.2
3/5 ~ 0.6
7/10 ~ 0.7
`);
lesson('math',8,'match','Expression Connections','Expand and simplify',`
3(x + 4) ~ 3x + 12
2(4x − 1) ~ 8x − 2
5x + 2x ~ 7x
6x − x ~ 5x
x × x × x ~ x³
(x + 2)(x + 3) ~ x² + 5x + 6
`);
lesson('math',7,'order','Solution Builder','Order the working',`
Solve 2x + 3 = 11. ~ 2x + 3 = 11|2x = 8|x = 4
Solve 3x − 4 = 14. ~ 3x − 4 = 14|3x = 18|x = 6
Find 20% of 60. ~ 20% = 20/100|20/100 × 60|12
Add 1/2 + 1/4. ~ 1/2 + 1/4|2/4 + 1/4|3/4
Solve x ÷ 5 + 2 = 6. ~ x ÷ 5 + 2 = 6|x ÷ 5 = 4|x = 20
Find the mean of 3, 5, and 10. ~ 3 + 5 + 10 = 18|18 ÷ 3|6
`);
lesson('math',8,'order','Algebra Architect','Multi-step solutions',`
Solve 2(x + 3) = 18. ~ 2(x + 3) = 18|x + 3 = 9|x = 6
Solve 5x − 2 = 3x + 10. ~ 5x − 2 = 3x + 10|2x − 2 = 10|2x = 12|x = 6
Solve 3(x − 1) = 12 by expanding. ~ 3(x − 1) = 12|3x − 3 = 12|3x = 15|x = 5
Find the hypotenuse with legs 6 and 8. ~ c² = 6² + 8²|c² = 36 + 64|c² = 100|c = 10
Calculate (2³)². ~ (2³)²|2⁶|64
Solve x ÷ 4 − 3 = 2. ~ x ÷ 4 − 3 = 2|x ÷ 4 = 5|x = 20
`);
lesson('math',7,'board','Geometry Challenge Board','Angles, area and perimeter',`
A rectangle is 8 cm by 5 cm. Find its area. ~ 40 cm²
A triangle has angles 50° and 60°. Find the third angle. ~ 70°
A square has side length 7 cm. Find its perimeter. ~ 28 cm
A triangle has base 10 cm and perpendicular height 6 cm. Find its area. ~ 30 cm²
Two angles lie on a straight line. One is 125°. Find the other. ~ 55°
A cuboid measures 2 cm × 3 cm × 4 cm. Find its volume. ~ 24 cm³
`);
lesson('math',8,'board','Geometry Master Board','Pythagoras and compound measures',`
A right triangle has legs 5 cm and 12 cm. Find the hypotenuse. ~ 13 cm
A circle has radius 7 cm. Give its area in terms of π. ~ 49π cm²
A car travels 150 km in 3 hours. Find its average speed. ~ 50 km/h
A cylinder has radius 3 cm and height 5 cm. Give its volume in terms of π. ~ 45π cm³
A right triangle has hypotenuse 10 cm and a leg of 6 cm. Find the other leg. ~ 8 cm
Find each interior angle of a regular hexagon. ~ 120°
`);
lesson('math',7,'wager','Percentage Stakes','Percentages in everyday life',`
What is 25% of 80? ~ 20 ~ 25 / 40 / 15
A 200-som item has a 10% discount. What is the sale price? ~ 180 som ~ 190 som / 20 som / 220 som
Write 0.35 as a percentage. ~ 35% ~ 3.5% / 0.35% / 350%
15 out of 60 students cycle. What percentage is that? ~ 25% ~ 15% / 40% / 30%
Increase 50 by 20%. ~ 60 ~ 70 / 55 / 40
What is 5% of 300? ~ 15 ~ 5 / 60 / 150
`);
lesson('math',8,'wager','Probability Stakes','Simple and combined events',`
A fair die is rolled. P(even number) = ? ~ 1/2 ~ 1/3 / 1/6 / 2/3
Two fair coins are tossed. P(two heads) = ? ~ 1/4 ~ 1/2 / 3/4 / 1
A bag has 3 red and 5 blue counters. P(red) = ? ~ 3/8 ~ 5/8 / 3/5 / 1/3
P(rain) = 0.3. P(no rain) = ? ~ 0.7 ~ 0.3 / 1.3 / 0.03
A fair die is rolled. P(a number greater than 4) = ? ~ 1/3 ~ 1/2 / 2/3 / 1/6
A fair coin is tossed twice. P(exactly one head) = ? ~ 1/2 ~ 1/4 / 3/4 / 1
`);
lesson('math',7,'survival','Data Guardians','Mean, median, mode and range',`
Find the mean of 4, 6, and 8. ~ 6 ~ 4 / 8 / 18
Find the median of 2, 3, 7, 9, 10. ~ 7 ~ 3 / 6.2 / 9
Find the mode of 1, 2, 2, 3, 4. ~ 2 ~ 1 / 3 / 4
Find the range of 5, 8, 12, 15. ~ 10 ~ 15 / 5 / 7
Find the median of 4, 6, 8, 10. ~ 7 ~ 6 / 8 / 14
The mean of 5 numbers is 8. What is their total? ~ 40 ~ 13 / 3 / 1.6
`);
lesson('math',8,'survival','Algebra Guardians','Algebraic fluency',`
Simplify 4a + 3b − 2a + b. ~ 2a + 4b ~ 2a + 2b / 6a + 4b / 6ab
Factorise 6x + 9. ~ 3(2x + 3) ~ 6(x + 9) / 3(2x + 9) / 9(x + 6)
Expand (x + 2)². ~ x² + 4x + 4 ~ x² + 4 / x² + 2x + 4 / 2x + 4
Simplify x⁷ ÷ x³ for x ≠ 0. ~ x⁴ ~ x¹⁰ / x²¹ / x³
Solve 3x < 12. ~ x < 4 ~ x > 4 / x < 9 / x = 4
Evaluate 2a² when a = −3. ~ 18 ~ −18 / 36 / −12
`);
lesson('math',7,'clue','Number Detective','Reasoning about numbers',`
I am a prime number between 20 and 25. ~ 23 ~~ My digits add to 5.
I am the smallest positive common multiple of 6 and 8. ~ 24 ~~ I am less than 30.
I am the highest common factor of 18 and 30. ~ 6 ~~ I am an even divisor of 18.
I equal 3/4 and have denominator 20. ~ 15/20 ~~ Multiply numerator and denominator by 5.
My square is 81. Give the positive answer. ~ 9 ~~ I am between 8 and 10.
I am 30% of 90. ~ 27 ~~ Find 10%, then multiply by 3.
`);
lesson('math',8,'clue','Algebra Detective','Patterns and reasoning',`
Sequence: 5, 8, 11, 14… Find the nth term, starting at n = 1. ~ 3n + 2 ~~ The common difference is 3.
I am positive. My cube is 125. ~ 5 ~~ My square is 25.
I am the gradient of a line parallel to y = 4x − 1. ~ 4 ~~ Parallel non-vertical lines have equal gradients.
I am the positive solution of x² = 64. ~ 8 ~~ I am the square root of 64.
A price rises from 80 to 100 som. Find the percentage increase. ~ 25% ~~ Divide the increase of 20 by the original 80.
I am the sum of the interior angles of a pentagon. ~ 540° ~~ Use (n − 2) × 180° with n = 5.
`);

// Answer choices for independent two-player treasure challenges.
const TREASURE_CHOICES={"english-7-board":[["Only the location of the final scene.","The lesson learned by the reader.","The order in which events happen."],["The person who wrote the story.","Always the villain of the story.","The reader of the story."],["A description of the weather.","The final sentence of every story.","The place where a story happens."],["Only by giving the chapter a title.","By removing all dialogue.","Only through the page numbers."],["The list of characters at the beginning.","A quiet description before the conflict.","Every event after the resolution."],["Using only he or she.","Using only you.","Never using pronouns."]],"english-8-board":[["Evidence that always supports your claim.","A summary of the introduction.","A statement unrelated to the topic."],["To replace all evidence with opinions.","To prove that every view is equally supported.","To avoid explaining your position."],["Litter is a noun.","Please pick up that bottle.","There are three bins near the gate."],["Claims are always facts; evidence is always opinion.","Evidence is a position; a claim is supporting data.","They mean exactly the same thing."],["A repeated claim without reasoning.","A question that starts a new topic.","A list of sources without explanation."],["Reliable sources make evidence unnecessary.","The newest source is always correct.","All published claims are equally accurate."]],"math-7-board":[["26 cm²","80 cm²","13 cm²"],["110°","60°","80°"],["49 cm","14 cm","21 cm"],["60 cm²","16 cm²","120 cm²"],["65°","125°","235°"],["9 cm³","18 cm³","48 cm³"]],"math-8-board":[["17 cm","7 cm","169 cm"],["14π cm²","7π cm²","98π cm²"],["450 km/h","150 km/h","53 km/h"],["15π cm³","30π cm³","90π cm³"],["4 cm","16 cm","64 cm"],["60°","108°","135°"]]};
for(const lesson of GAMES)if(TREASURE_CHOICES[lesson.id])lesson.items.forEach((q,i)=>q.options=TREASURE_CHOICES[lesson.id][i]);
// Each format has one objective owner; modes are not interchangeable player counts.
const GAME_MODES={
 SOLO:{key:'one',label:'👤 Solo',description:'Individual challenges students control at their own pace.',control:'Student controls',objective:'Personal mastery'},
 DUEL:{key:'two',label:'⚔️ 2 Player',description:'Exactly two students compete or cooperate directly.',control:'Two independent controls',objective:'You and your partner affect the outcome'},
 TEAM:{key:'teams',label:'🔴 Teams',description:'Small groups share resources, roles and strategic decisions.',control:'Groups decide; teacher hosts',objective:'A shared objective for each team'},
 CLASS:{key:'class',label:'🏫 Whole Class',description:'One teacher-led experience involving everyone in the room.',control:'Teacher controls',objective:'The whole classroom participates together'}
};
for(const [id,format] of Object.entries(FORMATS))format.mode=['tug','relay','board'].includes(id)?'DUEL':id==='clue'?'CLASS':'SOLO';
Object.assign(FORMATS,{
 kingdom:{mode:'TEAM',name:'Kingdom Builders',icon:'♜',description:'Earn shared resources, negotiate investments, and build your kingdom.',instructions:'Create 2–6 teams. Each round everyone discusses the same challenge, then captains lock answers before reveal. Correct answers earn 2 wood, 2 stone and 2 gold. Strategists choose one investment per team: farms and quarries improve future income; monuments earn prestige. Rotate captain, researcher and strategist each round. Highest prestige plus one point per 3 leftover resources wins.'},
 corners:{mode:'CLASS',name:'Four Corners',icon:'◈',description:'Move, vote, explain, and discover the answer together.',instructions:'Label four classroom corners A–D. Students move to their answer, point, or show a letter from their seat. Ask students to explain their choice. Optionally record each corner’s count, then reveal and discuss. The teacher advances everyone together; there is no individual winner.'},
 earth:{mode:'CLASS',name:'Save Our Earth',icon:'◎',description:'One classroom, one planet, one shared mission.',instructions:'The class shares a planet starting at 60 health. Discuss or vote on each question, then the teacher selects the class answer and reveals it. A correct answer restores 10 health (maximum 100); a wrong answer costs 15. Finish the full lesson with health remaining to succeed together.'}
});
for(const subject of ['english','math'])for(const grade of [7,8]){
 const source=GAMES.find(g=>g.id===`${subject}-${grade}-quiz`);
 for(const format of ['kingdom','corners','earth'])GAMES.push({...JSON.parse(JSON.stringify(source)),id:`${subject}-${grade}-${format}`,format,title:`${FORMATS[format].name}: ${source.topic}`,minutes:format==='kingdom'?'20–30':'10–15'});
}
FORMATS.boozled={mode:'TEAM',name:'Kareem-Boozled',icon:'🎲',description:'Pick mystery tiles, answer together and survive surprise score twists.',instructions:'Teams take turns choosing a hidden tile. Discuss questions, reveal the model answer, then the teacher awards 15 points for a correct answer or 0 for a miss. Surprise tiles swap scores, steal up to 20, lose 20, gain 50, or make a rival lose 20. Choose a rival for targeted effects. Scores never fall below zero. Highest score when all tiles are used wins.'};
for(const subject of ['english','math'])for(const grade of [7,8]){const source=GAMES.find(g=>g.id===`${subject}-${grade}-quiz`);GAMES.push({...JSON.parse(JSON.stringify(source)),id:`${subject}-${grade}-boozled`,format:'boozled',title:`Kareem-Boozled: ${source.topic}`,minutes:'15–20'});}
