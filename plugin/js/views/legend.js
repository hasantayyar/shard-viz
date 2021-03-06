// legend.js

// Copyright 2012 Phillip Quiza, Andrei Nagornyi

/**
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

define([
  "jquery",
  "underscore",
  "backbone",
  "d3",
  "d3_charts/d3_legend"
], function( $ , _ , Backbone , d3 , LegendChart ){

  var LegendView = Backbone.View.extend({

    initialize : function(options){
      this.eventAgg = options.eventAgg;
      this.eventAgg.bind( "router:clean" , this.destroy , this );
      this.chart = options.chart;
      this.legend = LegendChart( d3.select(this.el) );
      this.mode = options.mode;
      this.model.bind( "configdata:fetch" , this.render, this);
      this.model.bind( "configdata:loaded" , this.render , this);
      this.model.bind( "condigdata:replay" , this.render, this);
      if(this.model.initLoad){
        this.render();
      }
      return this;
    } , 
    render : function(){
      if(this.mode == "collections:collections"){
        this.legend( this.chart.legend(this.model.toJSON()).collections );
      } else if(this.mode == "collections:shards"){
        this.legend( this.chart.legend(this.model.toJSON()).shards );
      } else {
        this.legend( this.chart.legend(this.model.toJSON()));
      }
    } , 
    destroy : function(){
      d3.select("#legend-svg").remove();
      this.eventAgg.unbind("router:clean" , this.destroy);
      this.model.unbind( "configdata:fetch" , this.render );
      this.model.unbind( "configdata:loaded" , this.render );
      this.model.unbind( "configdata:render" , this.render );
    }
  });

  return LegendView;  

});