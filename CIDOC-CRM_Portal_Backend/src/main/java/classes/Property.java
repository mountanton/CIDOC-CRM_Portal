/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package classes;

/**
 *
 * @author Theo
 */
public class Property {

    public int id;
    public String prop;
    public int requestSize;
    public int triples;
    public String url;
    public int distinctSubjects;
    public int distinctObjects;

    public Property() {
    }

    public Property(int id, String prop, int triples, int requestSize) {
        this.id = id;
        this.prop = prop;
        this.triples = triples;
        this.requestSize = requestSize;
    }

}
