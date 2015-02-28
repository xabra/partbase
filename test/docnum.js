// --- docnum.js

function DocumentNumber()
{
	this.fields = [
		{type: 'text', value: 'VX'},
		{type: 'base', value: 223, digits: 5, padded: true},
		{type: 'text', value: '-REV'},
		{type: 'revision', value: 1, format: 'N'}	
	];
}

DocumentNumber.prototype.incrementBase = function() {
	var ibase = this.findFieldOfType('base');
	this.fields[ibase].value++;
};

DocumentNumber.prototype.resetBase = function() {
	var ibase = this.findFieldOfType('base');
	this.fields[ibase].value = 0;
};

DocumentNumber.prototype.incrementRevision = function() {
	var ibase = this.findFieldOfType('revision');
	this.fields[ibase].value++;
};

DocumentNumber.prototype.resetRevision = function() {
	var ibase = this.findFieldOfType('revision');
	this.fields[ibase].value = 0;
};

DocumentNumber.prototype.findFieldOfType = function(t) {

	for(var i=0; i<this.fields.length; i++){
		if(this.fields[i].type == t) {return i;}
	}
	return undefined;
};

DocumentNumber.prototype.toString = function() {
	s='';
	for(var i=0; i<this.fields.length; i++){
		s += this.fieldToString(this.fields[i]);
	}
	return s;
};

DocumentNumber.prototype.fieldToString = function(field) {
	switch(field.type){
		case 'text':
			return field.value;
		case 'base':
			return field.value.toString();
		case 'revision':
			return field.value.toString();
		default:
			return '';
	}
};
