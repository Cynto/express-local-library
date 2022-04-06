const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, max: 100 },
  family_name: { type: String, required: true, max: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(() => {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case

  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(() => {
  let lifespan = '';
  if (this.date_of_birth && this.date_of_death) {
    lifespan = this.date_of_birth + ' - ' + this.date_of_death;
  }
  if (!this.date_of_birth || !this.date_of_death) {
    lifespan = '';
  }
  return lifespan;
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function () {
  return '/catalog/author/' + this._id;
});
// Virtual for author's name;
AuthorSchema.virtual('name').get(function () {
  return this.first_name + ' ' + this.family_name;
});

// Virtual for author's DOB
AuthorSchema.virtual('date_of_birth_formatted').get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toFormat('dd LLL yyyy')
    : '';
});
// Virtual for author's DOD
AuthorSchema.virtual('date_of_death_formatted').get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toFormat('dd LLL yyyy')
    : '';
});
// Virtual for author's DOB for form
AuthorSchema.virtual('dob').get(function () {
  return DateTime.fromJSDate(this.date_of_birth).toISODate();
});
// Virtual for author's DOD for form
AuthorSchema.virtual('dod').get(function () {
  return DateTime.fromJSDate(this.date_of_death).toISODate();
});

// Virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function () {
  if (this.date_of_birth) {
    let birth = DateTime.fromJSDate(this.date_of_birth);
    let death = DateTime.fromJSDate(this.date_of_death);
    let current = DateTime.local();
    return this.date_of_death
      ? death.diff(birth, ['years']).toFormat('y') + ' Years old at death.'
      : current.diff(birth, ['years']).toFormat('y') + ' Years old.';
  } else return;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
