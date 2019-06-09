
   var buisnessGrowth = [];
   var cityState = [];
   var population = [];  
   var income = [];
   var taxRank = [];  
   var educationalAttainment = [];
   var commuteTime = [];
   var crimeRate = [];
   var cityName =[];
   var stateName =[];

function init(){
    d3.json(("/metadata")).then((data) => {
   
    data.keys.forEach(element => {
        buisnessGrowth.push(element.biz_growth_Y) 
        income.push(element.median_household_inc)
        taxRank.push(element.tax_rank)
        population.push(element.population_2016)
        cityName.push(element.city)
        stateName.push(element.state) 
        educationalAttainment.push(element.bach_or_higher_percent)
        commuteTime.push(element.agg_commute_mins)
        cityState.push(element.city_state)
    });
    var trace1 = {
     
           x : population,
           y : buisnessGrowth,
   
           mode: 'markers',
           type : "scatter",
           name: 'City Name',
           text: cityState,
           marker : {size: 6}
           };

    var sData = [trace1];
   
    var layout = {
       height: 600,
       width: 800,
       title: 'X vs Business Growth',
       xaxis: {
           title: {
               text:'Selected X Variable'
           }
       },
       yaxis: {
           title: {
               text: 'Business Growth %'
           }
       }
     };
   
     Plotly.plot('scatter', sData, layout);
    }) 
   }
   
   function updatePlotly(newdata) {
       const chart = document.getElementById("scatter");
       Plotly.restyle(chart, 'x', [newdata]);
       Plotly.relayout(chart, 'xaxis.title.text', [newtitle])
   }
   function getData(dataset) {
       let data = [];
       switch (dataset) {
           case "Population":
           data =  population ;
           break;
           case "EducationalAttainment":
           data = educationalAttainment;
           break;
           case "Household Income":
           data =  income;
           break;
           case "Commute Time":
           data =  commuteTime;
           break;
        //    case "Crime Rate":
        //    data =  crimeRate
           break;
           case "State Tax":
           data =  taxRank
           break;
           default:
           data =  population ;  
     }
     updatePlotly(data);
   }
   
   init();