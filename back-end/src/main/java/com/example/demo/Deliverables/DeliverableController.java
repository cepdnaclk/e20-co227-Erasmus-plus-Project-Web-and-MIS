package com.example.demo.Deliverables;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/deliverable")
public class DeliverableController {
    @Autowired
    private DeliverableService deliverableService;

    @PostMapping("/add")
    public String add(@RequestBody Deliverable deliverable) {
        deliverableService.addDeliverable(deliverable);
        return "A new deliverable is added ";
    }

    @GetMapping("/getAll")
    public List<Deliverable> getAll() {
        return deliverableService.getAllDeliverables();
    }
    @GetMapping("/view/{id}")
    public Deliverable view(@PathVariable String id) {
        return deliverableService.getDeliverableById(id);
    }

    @PutMapping("/update/{id}")
    public Deliverable update(@PathVariable String id, @RequestBody Deliverable deliverable ) {
        return deliverableService.updateDeliverable(id, deliverable);
    }
    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable String id) {
        return deliverableService.deleteDeliverable(id);
    }
}


