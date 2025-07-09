import PipelineDictionary = require('./PipelineDictionary');

declare class Pipeline {
  private constructor();

  /**
   * Executes a pipeline.
   *
   * @param {string} pipeline the pipeline identifier, must consist of the pipeline name and the start node name, like 'PipelineName-StartNodeName'
   */
  static execute(pipeline: string): PipelineDictionary;

  /**
   * Executes a pipeline. The pipeline dictionary will be initialized with the provided arguments.
   *
   * @param {string} pipeline - the pipeline identifier, must consist of a pipeline name and a start node name, like 'PipelineName-StartNodeName'
   * @param {object} args - an object whose properties represent the initial values of the pipeline dictionary
   */
  static execute(pipeline: string, args: object): PipelineDictionary;
}

export = Pipeline;
