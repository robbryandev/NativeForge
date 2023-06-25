import Generator from 'yeoman-generator';

class NativeForgeGenerator extends Generator {
    constructor(args: any, opts: any) {
      super(args, opts);
  
      this.argument('name', {
        required: true,
        type: String,
        description: 'The name of the thing',
      });
    }
  }
  
  module.exports = NativeForgeGenerator;