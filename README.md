# CIDOC-CRM Portal Code Files and Queries

This page contains the code for the CIDOC-CRM web portal (both for the backend and the frontends) 
and below all the SPARQL queries 
thar are used for A) creating the statistics and B) for all the modes of the portal


## A. SPARQL Queries for Creating the VoID Statistics for a given SPARQL Endpoint

Here, we present the queries for creating the VoID statistics.

1. SPARQL Query for the number of triples of a Dataset (void:triples)

```sparql
SELECT (COUNT(*) AS ?no)  { ?s ?p ?o }
```

2. SPARQL Query for  the number of the entities of a Dataset (void:entities)

```sparql
SELECT (COUNT(distinct ?s) AS ?no) { ?s a [] }
```
3. SPARQL Query for  the number of properties of a dataset (void:properties)

```sparql
SELECT (COUNT(distinct ?p) AS ?no) { ?s ?p ?o }
```
4. SPARQL Query for  the number of classes of a dataset (void:classes)

```sparql
SELECT (COUNT(distinct ?class) AS ?no) { ?s a ?class }
```

5. SPARQL Query for retrieving all the properties and the number of triples that they appear (void:propertyPartition)

```sparql
SELECT ?p (COUNT(?s) AS ?count ) { ?s ?p ?o } GROUP BY ?p ORDER BY ?count
```

6. SPARQL Query for retrieving all the classes and the number of triples that they appear (void:classPartition)

```sparql
SELECT ?class (COUNT(?s) AS ?count ) { ?s a ?class } GROUP BY ?class ORDER BY ?count
```

7. SPARQL Query for  the number of CIDOC-CRM properties of a dataset (void-crm:properties)

```sparql
SELECT (COUNT(distinct ?p) AS ?no) { ?s ?p ?o . filter(regex(str(?p),'http://www.cidoc-crm.org/cidoc-crm')) }
```
8. SPARQL Query for  the number of CIDOC-CRM classes of a dataset (void-crm:classes)

```sparql
SELECT (COUNT(distinct ?class) AS ?no) { ?s a ?class . filter(regex(str(?class),'http://www.cidoc-crm.org/cidoc-crm')) }
```

9. SPARQL Query for  the number of triples having a  CIDOC-CRM property (void-crm:triplesWithCIDOCProperty)

```sparql
SELECT (count(?s) as ?no) WHERE { ?s ?p ?o . filter(regex(str(?p),'http://www.cidoc-crm.org/cidoc-crm'))}
```
10. SPARQL Query for the number of triples having a  CIDOC-CRM instance (void-crm:triplesWithCIDOCinstance)

```sparql
SELECT (count(?o1) as ?no) WHERE { ?s a ?o . ?s ?p1 ?o1 . filter(regex(str(?o),'http://www.cidoc-crm.org/cidoc-crm'))}
```

## B. SPARQL Queries for all the modes of the web portal

Here we present the queries of the modes of the web portal
```sparql
Prefix void: <http://rdfs.org/ns/void#> .
Prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
Prefix dcterms: <http://purl.org/dc/terms/> .
Prefix void-crm: <http://www.ics.forth.gr/isl/void-crm/>.
Prefix crm: <http://www.cidoc-crm.org/cidoc-crm/>.
```
## B1. Datasets Mode

1. SPARQL Query for Retrieving all the statistics of a dataset
```sparql
select ?dataset ?title ?triples ?entities ?properties ?classes ?cidocProperties ?cidocClasses ?triplesWithCIDOCinstance ?triplesWithCIDOCproperty ?triplesWithCIDOCpropertyPercentage ?triplesWithCIDOCinstancePercentage where {
?dataset a void:Dataset . 
?dataset <http://purl.org/dc/terms/title> ?title . 
?dataset void:triples ?triples .
?dataset void:entities ?entities .
?dataset void:properties ?properties .
?dataset void:classes ?classes .
?dataset void-crm:propertiesCIDOC ?cidocProperties .
?dataset void-crm:classesCIDOC ?cidocClasses .
?dataset void-crm:triplesWithCIDOCinstance ?triplesWithCIDOCinstance .
?dataset void-crm:triplesWithCIDOCproperty ?triplesWithCIDOCproperty .
?dataset void-crm:triplesWithCIDOCpropertyPercentage ?triplesWithCIDOCpropertyPercentage .
?dataset void-crm:triplesWithCIDOCinstancePercentage ?triplesWithCIDOCinstancePercentage}
order by desc(xsd:integer(?triples ))
```

2. SPARQL Query for Retrieving all the properties of a dataset
```sparql
SELECT ?prop ?triples
WHERE{
<DATASET> void:propertyPartition ?o .
?o void:property ?prop .
?o void:triples ?triples }
ORDER BY DESC(xsd:integer(?triples))
```
3. SPARQL Query for Retrieving all the classes of a dataset
```sparql
SELECT ?class ?triples
WHERE{
<DATASET> void:classPartition ?o .
?o void:class ?class .
?o void:triples ?triples }
ORDER BY DESC(xsd:integer(?triples))
```

4. SPARQL Query for Retrieving all the CIDOC-CRM properties of a dataset
```sparql
SELECT ?prop ?triples
WHERE{
<DATASET> void:propertyPartition ?o .
?o void:property ?prop .
?o void:triples ?triples . filter(regex(str(?prop),'http://www.cidoc-crm.org/cidoc-crm')) }
ORDER BY DESC(xsd:integer(?triples))
```
5. SPARQL Query for Retrieving all the  CIDOC-CRM  classes of a dataset
```sparql
SELECT ?class ?triples
WHERE{
<DATASET> void:classPartition ?o .
?o void:class ?class .
?o void:triples ?triples . filter(regex(str(?class),'http://www.cidoc-crm.org/cidoc-crm')) }
ORDER BY DESC(xsd:integer(?triples))
```
## B2. Global Search Mode

1. SPARQL Query for Retrieving all the datasets for a given property
```sparql
select distinct ?s ?triples  FROM <http://www.ics.forth.gr/isl/CIDOC_VoID>
WHERE {
?s a void:Dataset .
?s void:propertyPartition ?p .
?p void:property <property> .
?p void:triples ?triples
} 
```
2. SPARQL Query for Retrieving all the datasets for a given class
```sparql
select distinct ?s ?triples  FROM <http://www.ics.forth.gr/isl/CIDOC_VoID>
WHERE {
?s a void:Dataset .
?s void:classPartition ?p .
?p void:class <RDFclassValue> .
?p void:triples ?triples
} 
```
## B3. Commonalities Mode

1. SPARQL Query for Retrieving all common properties of two datasets
```sparql
select ?property <Dataset1> <Dataset2> where
{
<Dataset1> void:propertyPartition ?o .
?o void:property ?property .
<Dataset2> void:propertyPartition ?o2 .
?o2 void:property ?property
} 
```

2. SPARQL Query for Retrieving all common classes of two datasets
```sparql
select ?class <Dataset1> <Dataset2> where
{
<Dataset1> void:classPartition ?o .
?o void:class ?class .
<Dataset2> void:classPartition ?o2 .
?o2 void:class ?class
} 
```

3. SPARQL Query for Retrieving all common CIDOC-CRM properties of two datasets
```sparql
select ?property <Dataset1> <Dataset2> where
{
<Dataset1> void:propertyPartition ?o .
?o void:property ?property .
<Dataset2> void:propertyPartition ?o2 .
?o2 void:property ?property .
. filter(regex(str(?prop),'http://www.cidoc-crm.org/cidoc-crm'))
} 
```

4. SPARQL Query for Retrieving all common classes of two datasets
```sparql
select ?class <Dataset1> <Dataset2> where
{
<Dataset1> void:classPartition ?o .
?o void:class ?class .
<Dataset2> void:classPartition ?o2 .
?o2 void:class ?class
. filter(regex(str(?class),'http://www.cidoc-crm.org/cidoc-crm'))
} 
```

## B4. Most Frequent 

1. SPARQL Query for Retrieving the most frequent properties (number of triples)
```sparql
select ?prop count(?dat) from <http://www.ics.forth.gr/isl/CIDOC_VoID>
where {
?dat a void:Dataset .
?dat void:propertyPartition ?part .
?part void:property ?prop .
} order by desc (count(?dat))
```

2. SPARQL Query for Retrieving the most frequent CIDOC-CRM properties (number of triples)
```sparql
select ?prop count(?dat) from <http://www.ics.forth.gr/isl/CIDOC_VoID>
where {
?dat a void:Dataset .
?dat void:propertyPartition ?part .
?part void:property ?prop .
?prop a rdf:Property
. filter(regex(?prop,\"http://www.cidoc-crm.org/cidoc-crm/\"))
} order by desc (count(?dat))
```

3. SPARQL Query for Retrieving the most frequent classes (number of triples)
```sparql
select ?class count(?dat) from <http://www.ics.forth.gr/isl/CIDOC_VoID>
where {
?dat a void:Dataset .
?dat void:classPartition ?part .
?part void:class ?class .
} order by desc (count(?dat))
```

4. SPARQL Query for Retrieving the most frequent CIDOC-CRM classes (number of triples)
```sparql
select ?class count(?dat) from <http://www.ics.forth.gr/isl/CIDOC_VoID>
where {
?dat a void:Dataset .
?dat void:classPartition ?part .
?part void:class ?prop .
?class a rdfs:Class
. filter(regex(?class,\"http://www.cidoc-crm.org/cidoc-crm/\"))
} order by desc (count(?dat))
```





