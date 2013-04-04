Questions = new Meteor.Collection("questions");
if (Meteor.isClient) {

  Template.HackOverflow.events({
    'click input#buttonAsk': function(){
      var question = document.getElementById("questionInput").value;
      Session.set('question', question);
      var id = Questions.insert({name: Meteor.user().username, question: question});
      Session.set('q_id', id);
    }
  });

  Template.question.events({
    'click input.answerBtn': function () {
      var id = Session.get('q_id');
      var ans = document.getElementById(id).value;
      Questions.update(
        {question: Session.get('question')},
        {
          $push: { answers: { answer: ans, user: Meteor.user().username } }
        });
    }
  });

  Template.HackOverflow.questions = function(){
    return Questions.find({});
  };

  Template.question.answers = function(){
    var curQuestion = Questions.find({question: this.question}).fetch();
    return curQuestion[0].answers;
  };

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  });

}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    // Questions.remove({});
  });
}