import Generator from 'yeoman-generator';

type BaseArgs = {
    name: string
}

module.exports = class extends Generator {
    constructor(args: string | string[], opts: BaseArgs) {
      super(args, opts);
  
      this.argument('name', {
        required: true,
        type: String,
        description: 'The name of the thing',
      });

    }

    method1() {
        this.log(this.options.name)
        this.log('method 1 just ran');
    }
  }