<!-- TOC -->autoauto- [category](#category)auto- [feature](#feature)autoauto<!-- /TOC -->


## feature
  - post: /questions

an example of question to post :
**Pay attention: no need to add date here, it will be created automatelly**
```sh
{   "author": "yue",
    "name": "testquestion",
    "category": "Ablation",
    "question": {
        "question": "How many hearts does a typical human have?",
        "answers": [
            {
                "id": 0,
                "answer": "Zero",
                "correct": false,
                "Explanation": "Typical humans have one heart."
            },
            {
                "id": 1,
                "answer": "One",
                "correct": true,
                "Explanation": "Typical humans have one heart."
            }
        ]
    }
}
```
  - get: /findQuestionByName/:name
  - get: /findQuestionByCategory/:category
  - get: /questions

**Pay attention:
About GET: All implemented fuzzy lookups that ignore case, for example, when looking for "xzz", you can finally find the names: "zXzz" and "xzZ92".**
an example of what can get
```sh
{
    "message": "Successfully found question.",
    "question": [
        {
            "_id": "5d12af08a701ec20dcac4353",
            "name": "321testquestion01",
            "category": "Ablation",
            "dateTime": "2019-6-25 18:32:24",
            "oneQuestion": {
                "author": "yue",
                "name": "321testquestion01",
                "category": "Ablation",
                "question": {
                    "question": "How many hearts does a typical human have?",
                    "answers": [
                        {
                            "id": 0,
                            "answer": "Zero",
                            "correct": false,
                            "Explanation": "Typical humans have one heart."
                        },
                        {
                            "id": 1,
                            "answer": "One",
                            "correct": true,
                            "Explanation": "Typical humans have one heart."
                        }
                    ]
                }
            }
        }
    ]
}
```
