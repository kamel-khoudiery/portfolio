// THE "WHERE DID YOU HEAR ABOUT ME?" CARD. First block = settings. Every block after it = one answer button.
// To add an answer: copy a block and change the label. A block with  input: yes  lets the visitor type their own answer.
// delay_seconds = how long before the card appears. max_asks = how many visits it may ask a person who skips (0 = no limit).
window.DATA=window.DATA||{};DATA.survey=`
title: Where did you hear about me?
subtitle: One tap is enough. It helps me a lot.
delay_seconds: 25
max_asks: 3
skip_label: Skip
thanks: Thank you!
other_placeholder: Tell me where
send_label: Send
---
label: Upwork
---
label: LinkedIn
---
label: Behance
---
label: Instagram
---
label: Facebook
---
label: X (Twitter)
---
label: TikTok
---
label: YouTube
---
label: Google search
---
label: An AI assistant
---
label: A friend or colleague
---
label: Other
input: yes
`;
