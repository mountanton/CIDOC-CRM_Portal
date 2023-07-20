/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package models;

import java.util.List;

/**
 *
 * @author Theo
 */
public class AutocompleteClassPropertyLists {

    public List<AutocompleteClassProperty> autocompleteProperty;
    public List<AutocompleteClassProperty> autocompleteClass;

    public AutocompleteClassPropertyLists(List<AutocompleteClassProperty> autocompleteProperty, List<AutocompleteClassProperty> autocompleteClass) {
        this.autocompleteProperty = autocompleteProperty;
        this.autocompleteClass = autocompleteClass;
    }
}
