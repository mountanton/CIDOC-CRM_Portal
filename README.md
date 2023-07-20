# CIDOC-CRM_Portal

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
PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>  
```


